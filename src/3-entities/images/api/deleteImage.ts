import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";
import { createClient } from "@/4-shared/lib/supabase/client";
import { notify } from "@/4-shared/lib/toast/toast";
import type { ImageRow } from "@/4-shared/types";

const DEBUG_IMAGES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_IMAGES !== "0";

function debugDeleteImage(message: string, payload?: unknown) {
  if (!DEBUG_IMAGES) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.info(`[images-debug][api.deleteImage][${ts}] ${message}`);
    return;
  }
  console.info(`[images-debug][api.deleteImage][${ts}] ${message}`, payload);
}

export async function deleteImage(image: ImageRow): Promise<boolean> {
  debugDeleteImage("start", {
    id: image.id,
    site_id: image.site_id,
    section_id: image.section_id,
    section: image.section,
    url: image.url,
    created_at: image.created_at,
  });
  const supabase = createClient();
  if (!image.url) {
    debugDeleteImage("missing-url", { id: image.id });
    return false;
  }

  // 1️⃣ remove from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET_TENANT)
    .remove([image.url]);

  if (storageError) {
    debugDeleteImage("storage-delete-error", {
      id: image.id,
      url: image.url,
      error: storageError.message,
    });
    notify.error("Failed to remove file from storage");
    return false;
  }
  debugDeleteImage("storage-delete-ok", { id: image.id, url: image.url });

  // 2️⃣ remove DB row AND VERIFY
  const { data, error: dbError } = await supabase
    .from("images")
    .delete()
    .eq("id", image.id)
    .select("id"); // 🔥 CRITICAL: forces returning rows

  if (dbError) {
    debugDeleteImage("db-delete-error", {
      id: image.id,
      error: dbError.message,
      details: dbError.details,
      hint: dbError.hint,
      code: dbError.code,
    });
    notify.error("Failed to delete image record");
    return false;
  }

  if (!data || data.length === 0) {
    debugDeleteImage("db-delete-empty-result", { id: image.id });
    notify.error("Image record was not deleted (RLS?)");
    return false;
  }
  debugDeleteImage("db-delete-ok", { id: image.id, returnedRows: data.length });
  notify.success("Image deleted");

  return true;
}
