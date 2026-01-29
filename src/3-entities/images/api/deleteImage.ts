import { supabase } from "@/4-shared/api/supabaseClient";
import type { ImageRow } from "@/4-shared/types";

/**
 * Deletes image storage object (if present) and DB row for the provided image.
 * Returns true on success, false on failure.
 */
export async function deleteImage(image: ImageRow): Promise<boolean> {
  try {
    if (image.bucket && image.path) {
      const { error: delErr } = await supabase.storage
        .from(image.bucket)
        .remove([image.path]);
      if (delErr) {
        console.error("[deleteImage] storage delete error:", delErr);
        return false;
      }
    }

    const { error: dbErr } = await supabase
      .from("images")
      .delete()
      .eq("id", image.id);
    if (dbErr) {
      console.error("[deleteImage] DB delete error:", dbErr);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[deleteImage] unexpected error:", err);
    return false;
  }
}
