import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Deletes the wedding_gift row for a site (if any).
 */
export async function deleteWeddingGiftBySite(
  siteId: string,
): Promise<boolean> {
  if (!siteId) throw new Error("Missing siteId");
  const supabase = await createClient();

  const { error } = await supabase
    .from("wedding_gift")
    .delete()
    .eq("site_id", siteId);

  if (error) {
    console.error("Delete wedding_gift error:", error.message);
    return false;
  }
  return true;
}
