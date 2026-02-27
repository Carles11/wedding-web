import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

/**
 * Returns a public URL for an image if available. For private buckets use signed URLs.
 */
export function getPublicUrlForImage(image: ImageRow): string | null {
  if (image.url) return image.url;
  if (!image.bucket || !image.path) return null;
  const supabase = createClient();
  const { data } = supabase.storage.from(image.bucket).getPublicUrl(image.path);
  return data?.publicUrl ?? null;
}
