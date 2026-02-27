import { createClient } from "@/4-shared/lib/supabase/client";
import type { ProgramEvent } from "@/4-shared/types";

export type CreateProgramEventPayload = Omit<
  ProgramEvent,
  "id" | "created_at"
> & {
  site_id: string;
};

export async function createProgramEvent(
  payload: CreateProgramEventPayload,
): Promise<ProgramEvent | null> {
  if (!payload?.site_id) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("program_events")
    .insert([payload])
    .select(
      "id, site_id, day_tag, date, time, title, location, location_url, description, sort_order, created_at",
    )
    .maybeSingle();

  if (error) {
    console.error("[createProgramEvent] DB insert error:", error);
    return null;
  }

  return (data as ProgramEvent) ?? null;
}
