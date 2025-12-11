import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Server helper to fetch global translations with a tiny in-memory cache.
 *
 * - Fetches rows from public.global_translations for `locale` and optional `fallbackLocale`.
 * - Prefers the requested locale values over fallback.
 * - Uses a globalThis cache map keyed by `${locale}:${fallbackLocale}` with TTL (default 300s).
 *
 * Usage:
 *  const globals = await fetchGlobalTranslations("ca", "en");
 *  // globals["common.learn_more"] -> "Coneix més"
 */

/* Type for a single row returned by Supabase */
type GlobalTranslationRow = {
  key: string;
  locale: string;
  value: string;
};

type CacheEntry = {
  value: Record<string, string>;
  expiresAt: number;
};

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

function getCache(): Map<string, CacheEntry> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(globalThis as any).__GLOBAL_TRANSLATIONS_CACHE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__GLOBAL_TRANSLATIONS_CACHE = new Map<
      string,
      CacheEntry
    >();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).__GLOBAL_TRANSLATIONS_CACHE as Map<
    string,
    CacheEntry
  >;
}

/**
 * Clears the in-memory cache (useful for testing or admin invalidation)
 */
export function clearGlobalTranslationsCache() {
  getCache().clear();
}

/**
 * Fetch and return a flattened map of translation_key => best_value
 * Preference: primary locale > fallback locale
 */
export async function fetchGlobalTranslations(
  locale: string,
  fallbackLocale: string | null = null,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<Record<string, string>> {
  if (!locale && !fallbackLocale) return {};

  const cacheKey = `${locale}::${fallbackLocale ?? ""}::${ttlSeconds}`;
  const cache = getCache();
  const now = Date.now();

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  // Build list of locales to query
  const localesToQuery =
    fallbackLocale && fallbackLocale !== locale
      ? [locale, fallbackLocale]
      : [locale];

  try {
    // NOTE: do not use a generic on .from(...) for SDK compatibility
    const { data, error } = await supabaseAdmin
      .from("global_translations")
      .select("key, locale, value")
      .in("locale", localesToQuery);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[fetchGlobalTranslations] supabase error:", error);
      return {};
    }

    // Build an intermediate map that keeps track of preferred / fallback
    const map: Record<string, { preferred?: string; fallback?: string }> = {};

    (data ?? []).forEach((row) => {
      const r = row as unknown as GlobalTranslationRow;
      if (!r || !r.key) return;
      const { key, locale: rowLocale, value } = r;
      if (!map[key]) map[key] = {};
      if (rowLocale === locale) {
        map[key].preferred = value;
      } else {
        // treat as fallback candidate
        map[key].fallback = value;
      }
    });

    const result: Record<string, string> = {};
    Object.keys(map).forEach((k) => {
      result[k] = map[k].preferred ?? map[k].fallback ?? "";
    });

    // Store in cache
    cache.set(cacheKey, {
      value: result,
      expiresAt: now + ttlSeconds * 1000,
    });

    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[fetchGlobalTranslations] unexpected error:", e);
    return {};
  }
}
