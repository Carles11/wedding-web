import { supabase } from "@/4-shared/api/supabaseClient";
import type { ProgramEvent } from "@/4-shared/types";

export async function updateProgramEvent(
  id: string,
  updates: Partial<ProgramEvent>,
): Promise<ProgramEvent | null> {
  if (!id) return null;

  const { data, error } = await supabase
    .from("program_events")
    .update(updates)
    .eq("id", id)
    .select(
      "id, site_id, day_tag, date, time, title, location, location_url, description, sort_order, created_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[updateProgramEvent] DB update error:", error);
    return null;
  }

  return (data as ProgramEvent) ?? null;
}
