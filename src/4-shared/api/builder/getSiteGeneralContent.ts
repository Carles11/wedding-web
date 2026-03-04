import { createClient } from "@/4-shared/lib/supabase/client";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

type GeneralContent = {
  languages: SupportedLanguage[];
  default_lang: SupportedLanguage;
  subdomain: string;
  heroId: string | null; // still keep for referencing image, etc.
  titles: Record<SupportedLanguage, string>;
  subtitles: Record<SupportedLanguage, string>;
};

export async function getSiteGeneralContent(
  site_id: string,
): Promise<GeneralContent> {
  const supabase = await createClient();

  // Get language config and subdomain
  const { data: site, error: siteErr } = await supabase
    .from("sites")
    .select("languages, default_lang, subdomain")
    .eq("id", site_id)
    .maybeSingle();
  if (siteErr) throw siteErr;
  if (!site) throw new Error("Site not found");

  // Use enabled languages
  const allLangs = Array.isArray(site.languages)
    ? site.languages
    : [site.default_lang ?? "en"];
  const enabledLangs: SupportedLanguage[] = SUPPORTED_LANGUAGES.filter((lang) =>
    allLangs.includes(lang as SupportedLanguage),
  ) as SupportedLanguage[];

  // Get hero section row just for id (not for title/description or image,
  // those are now in site_translations and images respectively for better i18n support)
  const { data: hero, error: heroErr } = await supabase
    .from("sections")
    .select("id, site_id,content")
    .eq("site_id", site_id)
    .eq("type", "hero")
    .maybeSingle();
  if (heroErr) throw heroErr;

  // Fetch hero title/description translations for all enabled languages in one query
  const { data: translations, error: trErr } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", site_id)
    .in("locale", enabledLangs)
    .in("key", [
      `hero.title.${hero?.site_id}`,
      `hero.description.${hero?.site_id}`,
    ]);
  if (trErr) throw trErr;
  // Build title/subtitle objects per language
  const titles: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  const subtitles: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  for (const lang of enabledLangs) {
    titles[lang] =
      translations?.find(
        (t) => t.key === `hero.title.${hero?.site_id}` && t.locale === lang,
      )?.value ?? "";
    subtitles[lang] =
      translations?.find(
        (t) =>
          t.key === `hero.description.${hero?.site_id}` && t.locale === lang,
      )?.value ?? "";
  }

  return {
    languages: enabledLangs,
    default_lang: site.default_lang ?? "en",
    subdomain: site.subdomain ?? "",
    heroId: hero?.site_id ?? null,
    titles,
    subtitles,
  };
}
