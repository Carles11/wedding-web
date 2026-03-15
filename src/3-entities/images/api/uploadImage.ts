import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";
import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { v4 as uuidv4 } from "uuid";

const DEBUG_IMAGES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_IMAGES !== "0";

function debugUploadImage(message: string, payload?: unknown) {
  if (!DEBUG_IMAGES) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.info(`[images-debug][api.uploadImage][${ts}] ${message}`);
    return;
  }
  console.info(`[images-debug][api.uploadImage][${ts}] ${message}`, payload);
}

export async function uploadImageForSite(
  siteId: string,
  file: File,
  section: "hero" | "contact",
  sectionId: string | null,
  subdomain: string,
  slot: string = "0",
): Promise<ImageRow | null> {
  debugUploadImage("start", {
    siteId,
    section,
    sectionId,
    subdomain,
    slot,
    file: {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    },
  });
  const supabase = createClient();

  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : uuidv4();

  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "jpg";

  const path = `${siteId}/${section}/${subdomain}_${uniqueId}.${fileExt}`;
  debugUploadImage("computed-path", { path });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    debugUploadImage("auth-error", {
      error: userError.message,
      details: userError.details,
      hint: userError.hint,
      code: userError.code,
    });
    throw userError;
  }
  if (!userData.user) {
    debugUploadImage("auth-missing-user");
    throw new Error("Not authenticated: cannot upload image!");
  }
  debugUploadImage("auth-ok", { userId: userData.user.id });

  // Upload to Supabase storage
  const { data: uplData, error: uplError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (uplError || !uplData) {
    debugUploadImage("storage-upload-error", {
      error: uplError?.message,
      path,
    });
    throw uplError ?? new Error("Failed to upload image");
  }
  debugUploadImage("storage-upload-ok", { path });

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

  if (dbError) {
    debugUploadImage("db-insert-error", {
      error: dbError.message,
      details: dbError.details,
      hint: dbError.hint,
      code: dbError.code,
    });
    throw dbError;
  }
  debugUploadImage("db-insert-ok", {
    inserted: inserted
      ? {
          id: inserted.id,
          site_id: inserted.site_id,
          section_id: inserted.section_id,
          url: inserted.url,
          created_at: inserted.created_at,
        }
      : null,
  });
  return inserted as ImageRow;
}
