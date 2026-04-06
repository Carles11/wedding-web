import { createClient } from "@/4-shared/lib/supabase/client";
import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";

export function getPublicUrlForImage(image: { url: string }): string | null {
  if (!image?.url) return null;
  const supabase = createClient();
  return supabase.storage.from(STORAGE_BUCKET_TENANT).getPublicUrl(image.url)
    .data.publicUrl;
}
