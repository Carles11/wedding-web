import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Fetch the 'details' section row for a given site.
 * Returns the full row (id, site_id, type, title, content) or null.
 */
export async function fetchDetailsSection(siteId: string) {
  if (!siteId) return null;
  const { data, error } = await supabaseAdmin
    .from("sections")
    .select("id, site_id, type, title, content")
    .eq("site_id", siteId)
    .eq("type", "details")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchDetailsSection] supabase error:", error);
    return null;
  }
  return data ?? null;
}
