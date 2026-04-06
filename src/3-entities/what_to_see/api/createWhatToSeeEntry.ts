import { createClient } from "@/4-shared/lib/supabase/client";
import type {
  WhatToSeeEntry,
  CreateWhatToSeePayload,
  WhatToSeeTranslation,
} from "@/4-shared/types";

/**
 * Create a what_to_see row and translations for i18n fields.
 */
export async function createWhatToSeeEntry(
  payload: CreateWhatToSeePayload, // { site_id, location_url, sort_order }
  translations: WhatToSeeTranslation[], // [{ key: "title"|"description"|"notes", locale, value }]
): Promise<WhatToSeeEntry | null> {
  if (!payload?.site_id) return null;

  const supabase = createClient();

  // 1. Insert the main what_to_see row (no i18n)
  const { data: itemData, error: itemError } = await supabase
    .from("what_to_see")
    .insert([payload])
    .select("id, site_id, location_url, sort_order, created_at")
    .maybeSingle();

  if (itemError || !itemData) {
    console.error("[createWhatToSeeEntry] DB insert error:", itemError);
    return null;
  }

  // 2. Insert translations into site_translations
  const translationsToInsert = translations.map((t) => ({
    site_id: payload.site_id,
    key: `what_to_see.${t.key}.${itemData.id}`,
    locale: t.locale,
    value: t.value,
  }));

  if (translationsToInsert.length > 0) {
    const { error: translationsError } = await supabase
      .from("site_translations")
      .insert(translationsToInsert);

    if (translationsError) {
      console.error(
        "[createWhatToSeeEntry] Translation insert error:",
        translationsError,
      );
      // You may want to delete what_to_see if translation insert fails.
      return null;
    }
  }

  // Return the DB row (sans i18n, as with program_events)
  return itemData as WhatToSeeEntry;
}
