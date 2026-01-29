import { supabase } from "@/4-shared/api/supabaseClient";
import type { ImageRow } from "@/4-shared/types";

const IMAGES_BUCKET = "images";

/**
 * Uploads a File to Supabase Storage and inserts an `images` row linking to it.
 * Returns the created ImageRow or null on failure.
 */
export async function uploadImageForSite(
  siteId: string,
  file: File,
): Promise<ImageRow | null> {
  if (!siteId) return null;

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-z0-9.-]/gi, "_");
  const path = `${siteId}/${timestamp}_${safeName}`;

  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadErr) {
    console.error("[uploadImageForSite] storage upload error:", uploadErr);
    return null;
  }

  // Insert DB row referencing the storage path
  const { data: inserted, error: insertErr } = await supabase
    .from("images")
    .insert([
      {
        site_id: siteId,
        bucket: IMAGES_BUCKET,
        path,
        metadata: { size: file.size, mime: file.type },
      },
    ])
    .select("id, site_id, bucket, path, url, section, metadata, created_at")
    .maybeSingle();

  if (insertErr) {
    console.error("[uploadImageForSite] DB insert error:", insertErr);
    return null;
  }

  return (inserted as ImageRow) ?? null;
}
