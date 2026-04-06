import { createClient } from "@/4-shared/lib/supabase/client";
import type { ProgramEvent, ProgramEventTranslation } from "@/4-shared/types";

/**
 * Update a program event row (structural fields only) and overwrite all associated translations.
 */
export async function updateProgramEvent(
  id: string,
  updates: Partial<Omit<ProgramEvent, "title" | "location" | "description">>,
  translations: ProgramEventTranslation[] = [],
): Promise<ProgramEvent | null> {
  if (!id) return null;

  const supabase = await createClient();

  // 1. Update the program_events row (structural fields only)
  const { data: eventData, error: eventError } = await supabase
    .from("program_events")
    .update(updates)
    .eq("id", id)
    .select(
      "id, site_id, day_tag, date, time, location_url, sort_order, is_main_event, created_at",
    )
    .maybeSingle();

  if (eventError || !eventData) {
    console.error("[updateProgramEvent] DB update error:", eventError);
    return null;
  }

  // 2. Update translations (overwrite all provided)
  if (translations.length > 0) {
    // Will insert/update each translation row (upsert on key/locale!)
    const upserts = translations.map((t) => ({
      site_id: eventData.site_id,
      key: `program.event.${t.key}.${id}`,
      locale: t.locale,
      value: t.value,
    }));

    const { error: translationError } = await supabase
      .from("site_translations")
      .upsert(upserts, { onConflict: "site_id,key,locale" }); // upsert for SaaS safety

    if (translationError) {
      console.error(
        "[updateProgramEvent] Translation upsert error:",
        translationError,
      );
      // Could consider failing or warn UI
    }
  }

  return eventData as ProgramEvent;
}
