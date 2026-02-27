import { createClient } from "@/4-shared/lib/supabase/client";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

type GeneralContent = {
  languages: SupportedLanguage[];
  default_lang: SupportedLanguage;
  subdomain: string;
  heroId: string | null;
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

  // Robust handling: only use supported and enabled languages
  const allLangs = Array.isArray(site.languages)
    ? site.languages
    : [site.default_lang ?? "en"];

  // Filter out any languages that aren't truly supported by the app/types
  const enabledLangs: SupportedLanguage[] = SUPPORTED_LANGUAGES.filter((lang) =>
    allLangs.includes(lang as SupportedLanguage),
  ) as SupportedLanguage[];

  // Get hero section (if present)
  const { data: hero, error: heroErr } = await supabase
    .from("sections")
    .select("id, title, content")
    .eq("site_id", site_id)
    .eq("type", "hero")
    .maybeSingle();
  if (heroErr) throw heroErr;

  function parseMaybeJSON<T>(input: unknown): T | object {
    if (!input) return {};
    if (typeof input === "string") {
      try {
        return JSON.parse(input);
      } catch {
        return {};
      }
    }
    if (typeof input === "object") return input as T;
    return {};
  }
  const titleObj = parseMaybeJSON<Record<SupportedLanguage, string>>(
    hero?.title,
  );
  const contentObj = parseMaybeJSON<{
    description?: Record<SupportedLanguage, string>;
    backgroundImage?: string;
  }>(hero?.content);

  // Fix: Get description as subtitle
  let subtitleObj: Partial<Record<SupportedLanguage, string>> = {};

  if (
    contentObj &&
    typeof contentObj === "object" &&
    "description" in contentObj &&
    typeof (contentObj as { description?: Record<SupportedLanguage, string> })
      .description === "object"
  ) {
    subtitleObj =
      (contentObj as { description?: Record<SupportedLanguage, string> })
        .description ?? {};
  }

  // Build per-supported-language subtitle and title objects
  const titles: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  const subtitles: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  for (const lang of enabledLangs) {
    titles[lang] = (titleObj as Record<SupportedLanguage, string>)[lang] ?? "";
    subtitles[lang] = subtitleObj[lang] ?? "";
  }

  return {
    languages: enabledLangs,
    default_lang: site.default_lang ?? "en",
    subdomain: site.subdomain ?? "",
    heroId: hero?.id ?? null,
    titles,
    subtitles,
  };
}
