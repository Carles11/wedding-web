import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Fetch the 'contact' section row for a given site.
 */
export async function fetchContactSection(siteId: string) {
  if (!siteId) return null;
  const { data, error } = await supabaseAdmin
    .from("sections")
    .select("id, site_id, type, title, subtitle, content, background")
    .eq("site_id", siteId)
    .eq("type", "contact")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchContactSection] supabase error:", error);
    return null;
  }
  console.log("xxxxxxxxxxxxxxxxcontact section data:", data);
  return data ?? null;
}
