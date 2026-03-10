import { FREE_ACCOMMODATION_LIMIT } from "@/4-shared/config/limits/usage-limits";
import { createClient } from "@/4-shared/lib/supabase/client";
import type {
  AccommodationEntry,
  AccommodationFormValues,
} from "@/4-shared/types";

// Update signature: form values type, not AccommodationEntry!
export async function createAccommodationEntry(
  siteId: string,
  entry: AccommodationFormValues,
): Promise<AccommodationEntry | null> {
  const isProUser = true; // TODO stub — do not check subscription in this MVP

  if (!siteId) return null;
  // Check plan limit
  const supabase = await createClient();
  const { data: existingRows, error: fetchError } = await supabase
    .from("accommodations")
    .select("id")
    .eq("site_id", siteId);

  if (fetchError) {
    console.error(
      "[createAccommodationEntry] supabase fetch error:",
      fetchError,
    );
    return null;
  }

  if (!isProUser && (existingRows?.length ?? 0) >= FREE_ACCOMMODATION_LIMIT) {
    return null;
  }

  // Insert new accommodation, adding site_id (not in form values!)
  const { data, error } = await supabase
    .from("accommodations")
    .insert([{ site_id: siteId, ...entry }])
    .select(
      "id, site_id, name, address, notes, website, phone, email, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("[createAccommodationEntry] supabase insert error:", error);
    return null;
  }
  return data as AccommodationEntry;
}
