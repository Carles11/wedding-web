import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Fetch the 'whatelse' section row for a given site.
 */
export async function fetchWhatElseSection(siteId: string) {
  if (!siteId) return null;
  const { data, error } = await supabaseAdmin
    .from("sections")
    .select("id, site_id, type, title, content")
    .eq("site_id", siteId)
    .eq("type", "whatelse")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchWhatElseSection] supabase error:", error);
    return null;
  }
  return data ?? null;
}
