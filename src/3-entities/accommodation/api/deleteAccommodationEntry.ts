import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Deletes an accommodation entry by ID from the accommodations table.
 * Returns true if deleted, false otherwise.
 */
export async function deleteAccommodationEntry(
  siteId: string,
  id: string,
): Promise<boolean> {
  if (!siteId || !id) return false;

  const supabase = await createClient();
  const { error } = await supabase
    .from("accommodations")
    .delete()
    .eq("id", id)
    .eq("site_id", siteId);

  if (error) {
    console.error("[deleteAccommodationEntry] supabase delete error:", error);
    return false;
  }
  return true;
}
