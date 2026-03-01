import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";

export async function deleteImage(image: ImageRow): Promise<boolean> {
  const supabase = createClient();
  if (!image.url) return false;
  console.log("Deleting DB row for image with id:", image.id);

  // Delete image file from bucket
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .remove([image.url]);
  if (storageError) console.error("Storage removal error:", storageError);
  else console.log("Storage file removed:", image.url);

  const { error: dbError } = await supabase
    .from("images")
    .delete()
    .eq("id", image.id);
  if (dbError) console.error("DB row delete error:", dbError);
  else console.log("Image DB row deleted:", image.id);

  return !dbError;
}
