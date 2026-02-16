import { supabase } from "@/4-shared/api/supabaseClient";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

type SiteGeneralContent = {
  languages: SupportedLanguage[];
  default_lang: SupportedLanguage;
  subdomain: string;
  titles: Record<SupportedLanguage, string>;
  subtitles: Record<SupportedLanguage, string>;
};

export async function getSiteGeneralContent(
  site_id: string,
): Promise<SiteGeneralContent> {
  // Fetch site metadata
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("languages, default_lang, subdomain")
    .eq("id", site_id)
    .maybeSingle();

  if (siteError) throw siteError;
  if (!site) throw new Error("Site not found");

  const languages: SupportedLanguage[] = Array.isArray(site.languages)
    ? site.languages
    : [site.default_lang ?? "en"];

  // Fetch all titles/subtitles for this site in all enabled languages
  const { data: translations, error: translationError } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", site_id)
    .in("locale", languages);

  if (translationError) throw translationError;

  // Structure values
  const supportedLanguages: SupportedLanguage[] = SUPPORTED_LANGUAGES.filter(
    (lang) => languages.includes(lang as SupportedLanguage),
  ) as SupportedLanguage[];

  const titles: Record<SupportedLanguage, string> = Object.fromEntries(
    supportedLanguages.map((lang) => [lang, ""]),
  ) as Record<SupportedLanguage, string>;
  const subtitles: Record<SupportedLanguage, string> = Object.fromEntries(
    supportedLanguages.map((lang) => [lang, ""]),
  ) as Record<SupportedLanguage, string>;

  for (const lang of supportedLanguages) {
    const titleRow = translations.find(
      (t) => t.key === "main_title" && t.locale === lang,
    );
    const subtitleRow = translations.find(
      (t) => t.key === "subtitle" && t.locale === lang,
    );
    titles[lang] = titleRow?.value ?? "";
    subtitles[lang] = subtitleRow?.value ?? "";
  }

  return {
    languages: supportedLanguages,
    default_lang: site.default_lang ?? "en",
    subdomain: site.subdomain ?? "",
    titles,
    subtitles,
  };
}
