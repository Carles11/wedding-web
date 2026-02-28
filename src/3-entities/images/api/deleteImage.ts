import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";

export async function deleteImage(image: ImageRow): Promise<boolean> {
  const supabase = createClient();
  if (!image.url) return false;
  // Delete image file from bucket
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .remove([image.url]);
  if (storageError) return false;

  // Then delete DB row
  const { error: dbError } = await supabase
    .from("images")
    .delete()
    .eq("id", image.id);
  return !dbError;
}
