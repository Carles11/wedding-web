import { supabase } from "@/4-shared/api/supabaseClient";
import type { ImageRow } from "@/4-shared/types";

/**
 * Update an image row by id. `updates` can include `section` to assign 'hero'|'contact' or null.
 * Returns the updated ImageRow or null on failure.
 */
export async function updateImage(
  id: string,
  updates: Partial<Pick<ImageRow, "section" | "url" | "metadata">>,
): Promise<ImageRow | null> {
  if (!id) return null;

  try {
    const { data, error } = await supabase
      .from("images")
      .update(updates)
      .eq("id", id)
      .select("id, site_id, bucket, path, url, section, metadata, created_at")
      .maybeSingle();

    if (error) {
      console.error("[updateImage] DB update error:", error);
      return null;
    }

    return (data as ImageRow) ?? null;
  } catch (err) {
    console.error("[updateImage] unexpected error:", err);
    return null;
  }
}

// TODO: For explicit slot support consider adding a `slot: 'hero' | 'contact'` column
// to the `images` table and migrate existing `section` values into it. Server-side
// enforcement of slot uniqueness per site would be ideal to prevent race conditions.
