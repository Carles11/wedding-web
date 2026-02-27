import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

/**
 * Fetch images for a given site id from the `images` table.
 * Returns an array of ImageRow or empty array.
 */
export async function fetchImagesBySite(siteId: string): Promise<ImageRow[]> {
  if (!siteId) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("images")
    .select("id, site_id, bucket, path, url, section, metadata, created_at")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchImagesBySite] Supabase error:", error);
    return [];
  }

  return (data as ImageRow[]) ?? [];
}
