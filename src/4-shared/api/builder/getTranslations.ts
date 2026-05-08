"use server";

import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import type { TranslationDictionary } from "@/4-shared/types";
import type { SupabaseClient } from "@supabase/supabase-js";

// 5-minute in-memory cache for builder translations
const BUILDER_CACHE_TTL_MS = 1000 * 60 * 5;

type BuilderCacheEntry = {
  value: TranslationDictionary;
  expiresAt: number;
};

type TranslationRow = {
  key: string;
  locale: string;
  value: string;
};

const TRANSLATIONS_PAGE_SIZE = 1000;

declare global {
  // eslint-disable-next-line no-var
  var __BUILDER_TRANSLATIONS_CACHE: Map<string, BuilderCacheEntry> | undefined;
}

function getBuilderCache(): Map<string, BuilderCacheEntry> {
  // Store cache on globalThis to survive hot reloads in dev
  if (!globalThis.__BUILDER_TRANSLATIONS_CACHE) {
    globalThis.__BUILDER_TRANSLATIONS_CACHE = new Map<
      string,
      BuilderCacheEntry
    >();
  }
  return globalThis.__BUILDER_TRANSLATIONS_CACHE;
}

function localeRank(
  rowLocale: string,
  preferredLocale: string,
  fallbackLocale: string,
): number {
  // We rank locale matches so translation selection is deterministic even if
  // Supabase returns rows in arbitrary order.
  // Priority:
  // 0) exact requested locale (e.g. "es-MX")
  // 1) base requested locale (e.g. "es")
  // 2) exact fallback locale (e.g. "en-GB")
  // 3) base fallback locale (e.g. "en")
  // 4) anything else (should not happen with current query input)
  const preferredBase = preferredLocale.split("-")[0];
  const fallbackBase = fallbackLocale.split("-")[0];

  if (rowLocale === preferredLocale) return 0;
  if (preferredBase && rowLocale === preferredBase) return 1;
  if (rowLocale === fallbackLocale) return 2;
  if (fallbackBase && rowLocale === fallbackBase) return 3;
  return 4;
}

async function fetchAllBuilderRows(
  supabase: SupabaseClient,
  localesToQuery: string[],
): Promise<TranslationRow[]> {
  // PostgREST/Supabase can apply row limits per request. We fetch in pages so
  // large translation tables do not silently drop keys.
  const rows: TranslationRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("global_translations_builder")
      .select("key, locale, value")
      .in("locale", localesToQuery)
      .range(from, from + TRANSLATIONS_PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const batch = (data ?? []) as TranslationRow[];
    rows.push(...batch);

    if (batch.length < TRANSLATIONS_PAGE_SIZE) {
      break;
    }

    from += TRANSLATIONS_PAGE_SIZE;
  }

  return rows;
}

export async function fetchBuilderTranslations(
  supabase: SupabaseClient,
  locale: string,
  fallbackLocale?: string,
): Promise<TranslationDictionary> {
  // "en" is the product-wide fallback when no explicit fallback is provided.
  const fallback = fallbackLocale ?? "en";
  if (!locale && !fallback) return {};

  // Cache by locale+fallback pair because each combination yields a different
  // resolved dictionary.
  const cacheKey = `builder:${locale}:${fallbackLocale ?? ""}`;
  const cache = getBuilderCache();
  const now = Date.now();

  const existing = cache.get(cacheKey);
  if (existing && existing.expiresAt > now) return existing.value;

  // Query both full locale and base locale to support cases like:
  // request "es-MX" with fallback "en-GB" while DB stores "es" / "en".
  const candidates = new Set<string>();
  const addLocale = (l?: string) => {
    if (!l) return;
    candidates.add(l);
    const base = l.split("-")[0];
    if (base) candidates.add(base);
  };
  addLocale(locale);
  if (fallback && fallback !== locale) addLocale(fallback);
  const localesToQuery = Array.from(candidates);

  try {
    const rows = await fetchAllBuilderRows(supabase, localesToQuery);

    // Select one winning value per key using the rank above.
    const selectedByKey: Record<string, { value: string; rank: number }> = {};

    rows.forEach((row) => {
      if (!row?.key) return;

      const rank = localeRank(row.locale, locale, fallback);
      const existing = selectedByKey[row.key];

      if (!existing || rank < existing.rank) {
        selectedByKey[row.key] = { value: row.value, rank };
      }
    });
    // Plan feature title keys may be defined in marketing namespace as
    // fallback options in the central plan catalog. Merge them here so
    // builder pages can localize those titles too.
    try {
      const { data: marketingData, error: marketingError } = await supabase
        .from("global_translations_marketing")
        .select("key, locale, value")
        .in("locale", localesToQuery)
        .like("key", "marketing.features.%_title");

      if (!marketingError) {
        (marketingData ?? []).forEach((row: unknown) => {
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

          const rank = localeRank(rowLocale, locale, fallback);
          const existing = selectedByKey[key];

          // Keep builder table values as source of truth for overlapping keys.
          if (!existing) {
            selectedByKey[key] = { value, rank };
          }
        });
      }
    } catch (e) {
      // Ignore optional merge and continue with builder/global payload only.
    }

    const result: TranslationDictionary = {};
    Object.keys(selectedByKey).forEach((k) => {
      result[k] = selectedByKey[k].value;
    });

    // Final safety net: fill still-missing keys from shared global translations.
    try {
      const global = await fetchGlobalTranslations(locale, fallback);
      Object.keys(global).forEach((k) => {
        if (!result[k] || result[k] === "") result[k] = global[k];
      });
    } catch (e) {
      // ignore errors
    }

    cache.set(cacheKey, {
      value: result,
      expiresAt: now + BUILDER_CACHE_TTL_MS,
    });

    return result;
  } catch (err) {
    console.error(
      "[builderTranslations] fetchBuilderTranslations unexpected error",
      err,
    );
    return {};
  }
}
