import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Delete a what_to_see entry and all its translations.
 */
export async function deleteWhatToSeeEntry(
  siteId: string,
  id: string,
): Promise<boolean> {
  if (!siteId || !id) return false;
  const supabase = createClient();

  // 1. Delete the main what_to_see row
  const { error: mainError } = await supabase
    .from("what_to_see")
    .delete()
    .eq("site_id", siteId)
    .eq("id", id);

  if (mainError) {
    console.error("[deleteWhatToSeeEntry] DB delete error:", mainError);
    return false;
  }

  // 2. Delete all related translations in site_translations
  const keyPrefixes = [
    `what_to_see.title.${id}`,
    `what_to_see.description.${id}`,
    `what_to_see.notes.${id}`,
  ];

  const { error: translationsError } = await supabase
    .from("site_translations")
    .delete()
    .eq("site_id", siteId)
    .in("key", keyPrefixes);

  if (translationsError) {
    console.error(
      "[deleteWhatToSeeEntry] Translation delete error:",
      translationsError,
    );
    // (Optional: consider restoring the deleted row if strict referential needed)
    return false;
  }

  return true;
}
