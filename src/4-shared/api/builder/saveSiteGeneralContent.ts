import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { createClient } from "@/4-shared/lib/supabase/client";
import { GlobalTranslationRow } from "@/4-shared/types";

type SaveOpts = {
  site_id: string;
  heroId: string | null;
  // content: { [lang in SupportedLanguage]: { title: string; subtitle: string } }
  content: Partial<
    Record<SupportedLanguage, { title: string; subtitle: string }>
  >;
  subdomain?: string;
  languages?: SupportedLanguage[];
  default_lang?: SupportedLanguage;
};

export async function saveSiteGeneralContent({
  site_id,
  heroId,
  content,
  subdomain,
  languages,
  default_lang,
}: SaveOpts): Promise<void> {
  const supabase = await createClient();
  const heroTranslationId = heroId ?? site_id;

  // Collect all translation rows to write in one statement
  const translationsToWrite: GlobalTranslationRow[] = [];
  for (const [lang, val] of Object.entries(content)) {
    if (!val) continue; // skip missing languages!

    translationsToWrite.push(
      {
        site_id,
        key: `hero.title.${heroTranslationId}`,
        locale: lang,
        value: val.title,
      },
      {
        site_id,
        key: `hero.description.${heroTranslationId}`,
        locale: lang,
        value: val.subtitle,
      },
    );
  }

  if (translationsToWrite.length) {
    const { error: upsertError } = await supabase
      .from("site_translations")
      .upsert(translationsToWrite, {
        onConflict: "site_id,key,locale",
        ignoreDuplicates: false,
      });
    if (upsertError) throw upsertError;
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
