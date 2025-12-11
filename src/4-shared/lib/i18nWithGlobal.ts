import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { getMergedTranslations } from "@/4-shared/lib/i18n";

/**
 * Returns merged translations that include global_translations (as defaults)
 * and your existing getMergedTranslations (site / tenant specific) which override globals.
 *
 * Merge order (applied):
 *   1) global translations (lowest priority)
 *   2) existing getMergedTranslations result (site-specific, overrides global)
 *
 * Use this wrapper in pages and components that currently call getMergedTranslations.
 */
export async function getMergedTranslationsWithGlobal(
  siteId: string | null,
  lang: string,
  fallbackLang = "en"
) {
  // fetch the site-specific translations (your existing logic)
  const siteTranslations =
    (await getMergedTranslations(siteId, lang, fallbackLang)) ?? {};

  // fetch global translations (defaults)
  const globalTranslations = await fetchGlobalTranslations(lang, fallbackLang);

  // final: siteTranslations overwrite globalTranslations when keys collide
  return {
    ...globalTranslations,
    ...siteTranslations,
  };
}
