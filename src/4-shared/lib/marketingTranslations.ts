import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";
import type { TranslationDictionary } from "@/4-shared/types";

const MARKETING_CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

type MarketingCacheEntry = {
  value: TranslationDictionary;
  expiresAt: number;
};

function getMarketingCache(): Map<string, MarketingCacheEntry> {
  // Persist cache on globalThis so it survives module reloads in dev
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(globalThis as any).__MARKETING_TRANSLATIONS_CACHE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__MARKETING_TRANSLATIONS_CACHE = new Map<
      string,
      MarketingCacheEntry
    >();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).__MARKETING_TRANSLATIONS_CACHE as Map<
    string,
    MarketingCacheEntry
  >;
}

/**
 * Fetch marketing page translations from `global_translations_marketing` table.
 *
 * This helper fetches translations for a primary `locale` and optionally a
 * `fallbackLocale`. Results are merged with primary values overriding fallback
 * values. A small in-memory cache (TTL 5 minutes) reduces DB load.
 *
 * NOTE: server-side only helper (uses `supabaseAdmin`).
 *
 * @param locale Primary locale code (e.g., "en", "es")
 * @param fallbackLocale Optional fallback locale (defaults to "en")
 * @returns Flat translation dictionary mapping keys to values
 *
 * @example
 * ```ts
 * // In a server component or API route:
 * const translations = await fetchMarketingTranslations('es', 'en');
 * const headline = translations['marketing.hero.headline'];
 * ```
 */
export async function fetchMarketingTranslations(
  locale: string,
  fallbackLocale?: string,
): Promise<TranslationDictionary> {
  const fallback = fallbackLocale ?? "en";
  if (!locale && !fallback) return {};

  const cacheKey = `marketing:${locale}:${fallbackLocale ?? ""}`;
  const cache = getMarketingCache();
  const now = Date.now();

  const existing = cache.get(cacheKey);
  if (existing && existing.expiresAt > now) return existing.value;

  const localesToQuery =
    fallback && fallback !== locale ? [locale, fallback] : [locale];

  try {
    const { data, error } = await supabaseAdmin
      .from("global_translations_marketing")
      .select("key, locale, value")
      .in("locale", localesToQuery);

    if (error) {
      console.error(
        "[marketingTranslations] fetchMarketingTranslations error",
        error,
      );
      return {};
    }

    const map: Record<string, { preferred?: string; fallback?: string }> = {};

    (data ?? []).forEach((row: unknown) => {
      const r = row as { key?: string; locale?: string; value?: string };
      if (!r || !r.key) return;
      const {
        key,
        locale: rowLocale,
        value,
      } = r as {
        key: string;
        locale: string;
        value: string;
      };
      if (!map[key]) map[key] = {};
      if (rowLocale === locale) map[key].preferred = value;
      else map[key].fallback = value;
    });

    const result: TranslationDictionary = {};
    Object.keys(map).forEach((k) => {
      result[k] = map[k].preferred ?? map[k].fallback ?? "";
    });

    cache.set(cacheKey, {
      value: result,
      expiresAt: now + MARKETING_CACHE_TTL_MS,
    });
    return result;
  } catch (err) {
    console.error(
      "[marketingTranslations] fetchMarketingTranslations unexpected error",
      err,
    );
    return {};
  }
}
