import { triggerSeoSync } from "@/4-shared/api/seo/triggerSeoSync";
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
  languages?: SupportedLanguage[];
  default_lang?: SupportedLanguage;
};

export async function saveSiteGeneralContent({
  site_id,
  heroId,
  content,
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
    const keys = Array.from(new Set(translationsToWrite.map((r) => r.key)));
    const locales = Array.from(
      new Set(translationsToWrite.map((r) => String(r.locale))),
    );

    const { data: existingRows, error: existingRowsError } = await supabase
      .from("site_translations")
      .select("id, site_id, key, locale, value")
      .eq("site_id", site_id)
      .in("key", keys)
      .in("locale", locales)
      .order("created_at", { ascending: true });
    if (existingRowsError) throw existingRowsError;

    // Defensive write path: delete current rows for these key/locale pairs first,
    // then insert exactly one row per pair. This avoids stale duplicate reads even
    // when DB unique constraints are missing or were added later.
    const { error: deleteError } = await supabase
      .from("site_translations")
      .delete()
      .eq("site_id", site_id)
      .in("key", keys)
      .in("locale", locales);
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from("site_translations")
      .insert(translationsToWrite);
    if (insertError) throw insertError;
  }

  // 2. If site language metadata needs updating:
  if (languages || default_lang) {
    const payload: Record<string, unknown> = {};
    if (languages) payload.languages = languages;
    if (default_lang) payload.default_lang = default_lang;

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase
        .from("sites")
        .update(payload)
        .eq("id", site_id);

      if (error) throw error;

      // Non-blocking SEO sync when languages change—Bing discovers new locale paths
      if (languages) {
        void triggerSeoSync(site_id);
      }
    }
  }
}
