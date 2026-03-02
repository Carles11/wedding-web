import { createClient } from "@/4-shared/lib/supabase/client";
import type {
  CreateProgramEventPayload,
  ProgramEvent,
  ProgramEventTranslation,
} from "@/4-shared/types";

/**
 * Create a program event row and all associated site_translations for i18n text fields
 */
export async function createProgramEvent(
  payload: CreateProgramEventPayload,
  translations: ProgramEventTranslation[],
): Promise<ProgramEvent | null> {
  if (!payload?.site_id) return null;

  const supabase = await createClient();

  // 1. Insert the event row (no i18n fields)
  const { data: eventData, error: eventError } = await supabase
    .from("program_events")
    .insert([payload])
    .select(
      "id, site_id, day_tag, date, time, location_url, sort_order, created_at",
    ) // no more title/location/description
    .maybeSingle();

  if (eventError || !eventData) {
    console.error("[createProgramEvent] DB insert error:", eventError);
    return null;
  }

  // 2. Insert translations into site_translations
  const translationsToInsert = translations.map((t) => ({
    id: undefined, // let DB default/gen_random_uuid()
    site_id: payload.site_id,
    key: `program.event.${t.key}.${eventData.id}`,
    locale: t.locale,
    value: t.value,
  }));

  const { error: translationsError } = await supabase
    .from("site_translations")
    .insert(translationsToInsert);

  if (translationsError) {
    console.error(
      "[createProgramEvent] Translation insert error:",
      translationsError,
    );
    // You may want to delete the event if translation insert fails,
    // or handle as appropriate for your product.
    return null;
  }

  // Return the event row (excluding removed i18n fields)
  return eventData as ProgramEvent;
}
