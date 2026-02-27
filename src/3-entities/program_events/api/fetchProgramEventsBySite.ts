import { createClient } from "@/4-shared/lib/supabase/client";
import type { ProgramEvent } from "@/4-shared/types";

export async function fetchProgramEventsBySite(
  siteId: string,
): Promise<ProgramEvent[]> {
  if (!siteId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("program_events")
    .select(
      `id, site_id,  date, time, title, location, description, sort_order, created_at`,
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[fetchProgramEventsBySite] Supabase error:", error);
    return [];
  }
  return (data as ProgramEvent[]) ?? [];
}
