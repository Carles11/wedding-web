import { createClient } from "@/4-shared/lib/supabase/client";
import type { AccommodationEntry } from "@/4-shared/types";

/**
 * Fetch all accommodation entries for a given site from the new accommodations table.
 */
export async function fetchAccommodationEntries(
  siteId: string,
): Promise<AccommodationEntry[]> {
  if (!siteId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accommodations")
    .select(
      "id, site_id, name, address, notes, website, phone, email, sort_order, created_at, updated_at",
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[fetchAccommodationEntries] supabase error:", error);
    return [];
  }
  return (data as AccommodationEntry[]) ?? [];
}
