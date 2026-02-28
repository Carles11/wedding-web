import { createClient } from "@/4-shared/lib/supabase/client";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

type SaveOpts = {
  site_id: string;
  heroId: string | null;
  lang: SupportedLanguage;
  title: string;
  subtitle: string;
  subdomain?: string; // only set if updating the subdomain
  languages?: SupportedLanguage[]; // if changing enabled langs
  default_lang?: SupportedLanguage;
};

export async function saveSiteGeneralContent({
  site_id,
  heroId,
  lang,
  title,
  subtitle,
  subdomain,
  languages,
  default_lang,
}: SaveOpts): Promise<void> {
  const supabase = await createClient();

  // 1. Upsert main_title + subtitle for selected language
  for (const [key, value] of [
    ["sections.hero.title", title],
    ["sections.hero.description", subtitle],
  ] as const) {
    const { error } = await supabase.from("site_translations").upsert(
      [
        {
          site_id,
          key,
          locale: lang,
          value,
        },
      ],
      { onConflict: "site_id,key,locale" },
    );

    if (error) throw error;
  }
  // 2. If site language metadata or subdomain needs updating:
  if (subdomain || languages || default_lang) {
    const payload: Record<string, unknown> = {};
    if (subdomain) payload.subdomain = subdomain;
    if (languages) payload.languages = languages;
    if (default_lang) payload.default_lang = default_lang;

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase
        .from("sites")
        .update(payload)
        .eq("id", site_id);

      if (error) throw error;
    }
  }
}
