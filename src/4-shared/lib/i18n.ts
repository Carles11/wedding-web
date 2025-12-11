import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

export type TranslationDictionary = Record<string, string>;

interface TranslationRow {
  key: string;
  value: string;
}

const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes
const cache = new Map<string, { ts: number; data: TranslationDictionary }>();

function cacheKey(siteId: string | null, locale: string) {
  return `${siteId ?? "global"}:${locale}`;
}

export async function fetchGlobalTranslations(
  locale: string
): Promise<TranslationDictionary> {
  try {
    const { data, error } = await supabaseAdmin
      .from("global_translations")
      .select("key, value")
      .eq("locale", locale);

    if (error) {
      console.error("[i18n] fetchGlobalTranslations error", error);
      return {};
    }
    const map: TranslationDictionary = {};
    (data ?? []).forEach((row: TranslationRow) => {
      map[String(row.key)] = String(row.value);
    });
    return map;
  } catch (err) {
    console.error("[i18n] fetchGlobalTranslations unexpected error", err);
    return {};
  }
}

export async function fetchSiteTranslations(
  siteId: string,
  locale: string
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

export async function getMergedTranslations(
  siteId: string | null,
  locale: string,
  fallbackLocale = "en"
): Promise<TranslationDictionary> {
  const key = cacheKey(siteId, locale);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const [globalRequested, globalFallback, siteRequested] = await Promise.all([
    fetchGlobalTranslations(locale),
    locale === fallbackLocale
      ? Promise.resolve({})
      : fetchGlobalTranslations(fallbackLocale),
    siteId ? fetchSiteTranslations(siteId, locale) : Promise.resolve({}),
  ]);

  const merged: TranslationDictionary = {
    ...(globalFallback || {}),
    ...(globalRequested || {}),
    ...(siteRequested || {}),
  };

  cache.set(key, { ts: Date.now(), data: merged });
  return merged;
}

export async function t(
  siteId: string | null,
  locale: string,
  keyName: string,
  fallbackLocale = "en"
): Promise<string> {
  const merged = await getMergedTranslations(siteId, locale, fallbackLocale);
  return merged[keyName] ?? merged[keyName.toLowerCase()] ?? keyName;
}

export function invalidateTranslationsCache(
  siteId: string | null,
  locale?: string
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
