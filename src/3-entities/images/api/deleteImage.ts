import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";
import { createClient } from "@/4-shared/lib/supabase/client";
import { notify } from "@/4-shared/lib/toast/toast";
import type { ImageRow } from "@/4-shared/types";

export async function deleteImage(image: ImageRow): Promise<boolean> {
  const supabase = createClient();
  if (!image.url) return false;

  // 1️⃣ remove from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .remove([image.url]);

  if (storageError) {
    notify.error("Failed to remove file from storage");
    return false;
  }

  // 2️⃣ remove DB row AND VERIFY
  const { data, error: dbError } = await supabase
    .from("images")
    .delete()
    .eq("id", image.id)
    .select("id"); // 🔥 CRITICAL: forces returning rows

  if (dbError) {
    notify.error("Failed to delete image record");
    return false;
  }

  if (!data || data.length === 0) {
    notify.error("Image record was not deleted (RLS?)");
    return false;
  }
  notify.success("Image deleted");

  return true;
}
