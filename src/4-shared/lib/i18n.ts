import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";
import {
  TranslationDictionary,
  GlobalTranslationRow,
  TranslationRow,
} from "../types";

const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes (site+locale cache)
const cache = new Map<string, { ts: number; data: TranslationDictionary }>();

function cacheKey(siteId: string | null, locale: string) {
  return `${siteId ?? "global"}:${locale}`;
}

/* =========================
   Global translations helper
   ========================= */

const DEFAULT_GLOBAL_TTL_MS = 1000 * 60 * 5; // 5 minutes

type GlobalCacheEntry = {
  value: TranslationDictionary;
  expiresAt: number;
};

function getGlobalCache(): Map<string, GlobalCacheEntry> {
  // store cache on globalThis so it survives module reloads in dev and is shared across imports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(globalThis as any).__GLOBAL_TRANSLATIONS_CACHE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__GLOBAL_TRANSLATIONS_CACHE = new Map<
      string,
      GlobalCacheEntry
    >();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).__GLOBAL_TRANSLATIONS_CACHE as Map<
    string,
    GlobalCacheEntry
  >;
}

/**
 * Clears the in-memory global translations cache.
 * Useful for testing or admin-triggered invalidation.
 */
export function clearGlobalTranslationsCache() {
  getGlobalCache().clear();
}

/**
 * Fetch global translations for a target locale with optional fallback locale.
 * Uses a small in-memory cache (TTL) to minimize DB calls.
 *
 * - locale: primary locale to prefer (e.g., "es")
 * - fallbackLocale: optional fallback (e.g., "en")
 * - ttlMs: cache TTL for this locale pair in milliseconds (defaults to DEFAULT_GLOBAL_TTL_MS)
 *
 * Returns a flat map of translation_key => value, preferring primary locale values
 * over fallback when both are present.
 */
export async function fetchGlobalTranslations(
  locale: string,
  fallbackLocale: string | null = null,
  ttlMs: number = DEFAULT_GLOBAL_TTL_MS,
): Promise<TranslationDictionary> {
  if (!locale && !fallbackLocale) return {};

  const cacheKeyGlobal = `${locale}::${fallbackLocale ?? ""}::${ttlMs}`;
  const globalCache = getGlobalCache();
  const now = Date.now();

  const cached = globalCache.get(cacheKeyGlobal);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  // Build list of locales to query in a single DB call (avoid two queries)
  const localesToQuery =
    fallbackLocale && fallbackLocale !== locale
      ? [locale, fallbackLocale]
      : [locale];

  try {
    // NOTE: avoid putting a generic type argument on .from(...) to keep compatibility across SDK versions.
    const { data, error } = await supabaseAdmin
      .from("global_translations")
      .select("key, locale, value")
      .in("locale", localesToQuery);

    if (error) {
      console.error("[i18n] fetchGlobalTranslations error", error);
      return {};
    }

    // Collect rows and prefer primary locale values
    const map: Record<string, { preferred?: string; fallback?: string }> = {};

    (data ?? []).forEach((row: unknown) => {
      const r = row as GlobalTranslationRow;
      if (!r || !r.key) return;
      const { key, locale: rowLocale, value } = r;
      if (!map[key]) map[key] = {};
      if (rowLocale === locale) {
        map[key].preferred = value;
      } else {
        map[key].fallback = value;
      }
    });

    const result: TranslationDictionary = {};
    Object.keys(map).forEach((k) => {
      result[k] = map[k].preferred ?? map[k].fallback ?? "";
    });

    // store in cache
    globalCache.set(cacheKeyGlobal, {
      value: result,
      expiresAt: now + ttlMs,
    });

    return result;
  } catch (err) {
    console.error("[i18n] fetchGlobalTranslations unexpected error", err);
    return {};
  }
}

/* =========================
   Site translations helper
   ========================= */

export async function fetchSiteTranslations(
  siteId: string,
  locale: string,
): Promise<TranslationDictionary> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_translations")
      .select("key, value")
      .eq("site_id", siteId)
      .eq("locale", locale);

    if (error) {
      console.error("[i18n] fetchSiteTranslations error", error);
      return {};
    }

    const map: TranslationDictionary = {};
    (data ?? []).forEach((row: TranslationRow) => {
      map[String(row.key)] = String(row.value);
    });
    return map;
  } catch (err) {
    console.error("[i18n] fetchSiteTranslations unexpected error", err);
    return {};
  }
}

/* =========================
   Main merged translations
   ========================= */

/**
 * Returns merged translations for a site and locale.
 *
 * Merge order (priority highest to lowest):
 *  - site-specific translations (site_translations)
 *  - global translations (global_translations) with primary locale preferred over fallback
 *
 * A per-site+locale in-memory cache prevents repeated merges for the CACHE_TTL_MS duration.
 */
export async function getMergedTranslations(
  siteId: string | null,
  locale: string,
  fallbackLocale = "en",
): Promise<TranslationDictionary> {
  const key = cacheKey(siteId, locale);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  // Fetch global translations in one call (helper prefers primary locale over fallback)
  const [globalMerged, siteRequested] = await Promise.all([
    fetchGlobalTranslations(locale, fallbackLocale),
    siteId ? fetchSiteTranslations(siteId, locale) : Promise.resolve({}),
  ]);

  const merged: TranslationDictionary = {
    ...(globalMerged || {}),
    ...(siteRequested || {}),
  };

  cache.set(key, { ts: Date.now(), data: merged });
  return merged;
}

/* =========================
   Convenience helpers
   ========================= */

export async function t(
  siteId: string | null,
  locale: string,
  keyName: string,
  fallbackLocale = "en",
): Promise<string> {
  const merged = await getMergedTranslations(siteId, locale, fallbackLocale);
  return merged[keyName] ?? merged[keyName.toLowerCase()] ?? keyName;
}

/**
 * Invalidate per-site+locale merge cache. Does not touch global translations cache.
 */
export function invalidateTranslationsCache(
  siteId: string | null,
  locale?: string,
) {
  if (locale) {
    cache.delete(cacheKey(siteId, locale));
    return;
  }
  const prefix = cacheKey(siteId, "");
  for (const k of cache.keys()) {
    if (k.startsWith(prefix)) cache.delete(k);
  }
}
