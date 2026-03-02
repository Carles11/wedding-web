import { createClient } from "@/4-shared/lib/supabase/client";

export async function fetchHasProgramEvents(siteId: string): Promise<boolean> {
  if (!siteId) return false;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("program_events")
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId);
  if (error) {
    console.error("[fetchHasProgramEvents] DB error:", error);
    return false;
  }
  return !!count && count > 0;
}
