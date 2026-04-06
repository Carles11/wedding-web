"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { AccommodationEntry } from "@/4-shared/types";

/**
 * Fetch accommodations (hotels) for a site from the new table.
 */
export async function fetchAccommodationEntriesForTenant(
  siteId: string,
): Promise<AccommodationEntry[]> {
  if (!siteId) return [];
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("accommodations")
    .select(
      "id, site_id, name, address, notes, website, phone, email, sort_order, created_at, updated_at",
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      "[fetchAccommodationEntriesForTenant] supabase error:",
      error,
    );
    return [];
  }
  return data ?? [];
}
