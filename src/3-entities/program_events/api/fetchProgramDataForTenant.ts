"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { ProgramEvent } from "@/4-shared/types";

/**
 * Fetch program events and return the main event and full list for details section.
 * All translations are fetched in the parent and passed down via `translations`.
 */
export async function fetchProgramSectionDataForTenant(
  siteId: string,
): Promise<{ mainEvent: ProgramEvent | null; events: ProgramEvent[] }> {
  const supabase = await createSupabaseSSRClient();

  const { data: events, error } = await supabase
    .from("program_events")
    .select(
      "id, site_id, day_tag, date, time, location_url, sort_order, created_at, is_main_event",
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (!events || error) {
    console.error("[fetchProgramSectionData] error:", error);
    return { mainEvent: null, events: [] };
  }

  // Prefer `is_main_event` boolean,
  // else fallback to first 'wedding_day' event,
  // else first event
  const mainEvent =
    events.find((ev) => ev.is_main_event) ||
    events.find((ev) => ev.day_tag === "wedding_day") ||
    events[0] ||
    null;

  return {
    mainEvent,
    events,
  };
}
