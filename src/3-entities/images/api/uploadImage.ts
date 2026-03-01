import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";
import { v4 as uuidv4 } from "uuid";

export async function uploadImageForSite(
  siteId: string,
  file: File,
  section: "hero" | "contact",
  sectionId: string | null,
  subdomain: string,
  slot: string = "0",
): Promise<ImageRow | null> {
  const supabase = createClient();

  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : uuidv4();

  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "jpg";

  const path = `${siteId}/${section}/${subdomain}_${uniqueId}.${fileExt}`;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (!userData) {
    throw new Error("Not authenticated: cannot upload image!");
  }

  // Upload to Supabase storage
  const { data: uplData, error: uplError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (uplError || !uplData)
    throw uplError ?? new Error("Failed to upload image");

  // Insert data into images table to read from in frontend
  const { data: inserted, error: dbError } = await supabase
    .from("images")
    .insert([
      {
        section_id: sectionId,
        site_id: siteId,
        url: path,
        caption: "",
      },
    ])
    .select()
    .maybeSingle();

  if (dbError) throw dbError;
  if (userError) throw userError;

  return inserted as ImageRow;
}
