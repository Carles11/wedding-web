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

  const supabase = createClient();

  const { data, error } = await supabase
    .from("accommodations")
    .delete()
    .eq("id", id)
    .eq("site_id", siteId)
    .select("id"); // 👈 FORCE returning deleted row

  if (error) {
    console.error("[deleteAccommodationEntry] supabase delete error:", error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
