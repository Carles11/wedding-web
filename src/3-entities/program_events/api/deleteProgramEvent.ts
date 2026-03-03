import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Deletes a program event row AND all related site_translations for title, location, description fields.
 */
export async function deleteProgramEvent(
  id: string,
  site_id?: string,
): Promise<boolean> {
  if (!id) return false;

  const supabase = await createClient();

  // 1. Delete event row
  const { error: eventError } = await supabase
    .from("program_events")
    .delete()
    .eq("id", id);

  if (eventError) {
    console.error("[deleteProgramEvent] DB delete error:", eventError);
    return false;
  }

  // 2. Optionally, delete translations by event key pattern (best practice for SaaS cleanup)
  // If site_id is provided, makes the deletion extra safe.
  const eventKeyPrefix = `program.event.`;
  const keysToDelete = [
    `${eventKeyPrefix}title.${id}`,
    `${eventKeyPrefix}location.${id}`,
    `${eventKeyPrefix}description.${id}`,
  ];

  let translationQuery = supabase
    .from("site_translations")
    .delete()
    .in("key", keysToDelete);

  if (site_id) {
    translationQuery = translationQuery.eq("site_id", site_id);
  }

  const { error: trError } = await translationQuery;

  if (trError) {
    console.error("[deleteProgramEvent] Translation delete error:", trError);
    // Fail silently (event is deleted, maybe translations weren't found)
  }

  return true;
}
