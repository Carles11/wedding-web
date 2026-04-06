import { createClient } from "@/4-shared/lib/supabase/client";
import type { AccommodationEntry } from "@/4-shared/types";

/**
 * Updates an existing accommodation entry in the accommodations table.
 * Returns the updated row, or null on error or if not found.
 */
export async function updateAccommodationEntry(
  siteId: string,
  id: string,
  updates: Partial<AccommodationEntry>,
): Promise<AccommodationEntry | null> {
  if (!siteId || !id) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accommodations")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("site_id", siteId)
    .select(
      "id, site_id, name, address, notes, website, phone, email, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("[updateAccommodationEntry] supabase update error:", error);
    return null;
  }
  return data as AccommodationEntry;
}
