import { STORAGE_BUCKET_TENANT } from "@/4-shared/lib/supabase/buckets";

export function getPublicUrlForTenantBucketImage(
  path: string,
  bucket = STORAGE_BUCKET_TENANT,
) {
  if (!path) return "";
  // If already a full URL, return as is
  if (path.startsWith("http")) return path;
  // Construct public URL
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
