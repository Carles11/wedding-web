"use server";

import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type { TranslationDictionary } from "@/4-shared/types";

// 5-minute in-memory cache for builder translations
const BUILDER_CACHE_TTL_MS = 1000 * 60 * 5;

type BuilderCacheEntry = {
  value: TranslationDictionary;
  expiresAt: number;
};

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

export async function fetchBuilderTranslations(
  locale: string,
  fallbackLocale?: string,
): Promise<TranslationDictionary> {
  const fallback = fallbackLocale ?? "en";
  if (!locale && !fallback) return {};

  const cacheKey = `builder:${locale}:${fallbackLocale ?? ""}`;
  const cache = getBuilderCache();
  const now = Date.now();

  const existing = cache.get(cacheKey);
  if (existing && existing.expiresAt > now) return existing.value;

  // Prepare locale variants (full + base) for both main and fallback
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
    const { data, error } = await supabaseAdmin
      .from("global_translations_builder")
      .select("key, locale, value")
      .in("locale", localesToQuery);

    if (error) {
      console.error(
        "[builderTranslations] fetchBuilderTranslations error",
        error,
      );
      return {};
    }

    // Build translation map: primary locale preferred, else fallback
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

    // Plan feature title keys may be defined in marketing namespace as
    // fallback options in the central plan catalog. Merge them here so
    // builder pages can localize those titles too.
    try {
      const { data: marketingData, error: marketingError } = await supabaseAdmin
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

          if (!map[key]) map[key] = {};
          if (rowLocale === locale) {
            if (!map[key].preferred) map[key].preferred = value;
          } else {
            if (!map[key].fallback) map[key].fallback = value;
          }
        });
      }
    } catch (e) {
      // Ignore optional merge and continue with builder/global payload only.
    }

    const result: TranslationDictionary = {};
    Object.keys(map).forEach((k) => {
      result[k] = map[k].preferred ?? map[k].fallback ?? "";
    });

    // Supplemental fallback: pull from global translations if missing
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
