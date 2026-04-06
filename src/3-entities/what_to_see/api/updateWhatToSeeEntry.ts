import { createClient } from "@/4-shared/lib/supabase/client";
import type { WhatToSeeEntry, WhatToSeeTranslation } from "@/4-shared/types";

/**
 * Update the main what_to_see row and associated i18n translations.
 */
export async function updateWhatToSeeEntry(
  siteId: string,
  id: string,
  updates: Partial<WhatToSeeEntry>, // Only non-i18n fields here, e.g. location_url, sort_order
  translations?: WhatToSeeTranslation[], // Array of {key, locale, value}
): Promise<WhatToSeeEntry | null> {
  if (!siteId || !id) return null;

  const supabase = createClient();

  // 1. Update the main what_to_see row
  if (updates && Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from("what_to_see")
      .update(updates)
      .eq("site_id", siteId)
      .eq("id", id);

    if (updateError) {
      console.error("[updateWhatToSeeEntry] DB update error:", updateError);
      return null;
    }
  }

  // 2. Upsert i18n translations as needed
  if (translations && translations.length > 0) {
    const translationsToUpsert = translations.map((t) => ({
      site_id: siteId,
      key: `what_to_see.${t.key}.${id}`,
      locale: t.locale,
      value: t.value,
    }));

    const { error: translationsError } = await supabase
      .from("site_translations")
      .upsert(translationsToUpsert, { onConflict: "site_id,key,locale" });

    if (translationsError) {
      console.error(
        "[updateWhatToSeeEntry] Translation upsert error:",
        translationsError,
      );
      // (Optional: roll back main update here if strict)
      return null;
    }
  }

  // 3. Fetch and return the updated row
  const { data: updated, error: fetchError } = await supabase
    .from("what_to_see")
    .select("id, site_id, location_url, sort_order, created_at, updated_at")
    .eq("site_id", siteId)
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !updated) {
    console.error("[updateWhatToSeeEntry] DB re-fetch error:", fetchError);
    return null;
  }

  return updated as WhatToSeeEntry;
}
