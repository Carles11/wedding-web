import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";

// Main upload handler
export async function uploadImageForSite(
  siteId: string,
  file: File,
  section: "hero" | "contact",
  sectionId: string | null,
  subdomain: string,
  slot: string = "0",
): Promise<ImageRow | null> {
  const supabase = createClient();
  console.log("[DEBUG] uploadImageForSite params", {
    siteId,
    file,
    sectionId,
    section,
    subdomain,
    slot,
  });

  const path = `${siteId}/${section}/${subdomain}_${slot}.jpg`;
  console.log("[DEBUG] Uploading file to storage...", {
    bucket: "tenant-images",
    path,
    file,
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log("[DEBUG] Supabase user", userData, userError);

  if (!userData) {
    throw new Error("Not authenticated: cannot upload image!");
  }
  // Upload to Supabase storage
  const { data: uplData, error: uplError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  console.log("[DEBUG] Upload result", { uplData, uplError });

  if (uplError || !uplData)
    throw uplError ?? new Error("Failed to upload image");

  // Insert into images table (always records bucket path in .url field)
  const { data: inserted, error: dbError } = await supabase
    .from("images")
    .insert([
      {
        section_id: sectionId, // uuid, from `sections` table
        site_id: siteId, // uuid, from current site/user context
        url: path, // file path in Supabase Storage bucket
        caption: "", // optional caption, can be empty string or null
      },
    ])
    .select()
    .maybeSingle();

  if (dbError) throw dbError;
  return inserted as ImageRow;
}
