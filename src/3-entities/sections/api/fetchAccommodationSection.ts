import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Fetch the 'accommodation' section row for a given site.
 */
export async function fetchAccommodationSection(siteId: string) {
  if (!siteId) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, subtitle,content")
    .eq("site_id", siteId)
    .eq("type", "accommodation")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchAccommodationSection] supabase error:", error);
    return null;
  }
  return data ?? null;
}
