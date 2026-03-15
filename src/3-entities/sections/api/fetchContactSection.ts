import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Fetch the 'contact' section row for a given site.
 */
export async function fetchContactSection(siteId: string) {
  if (!siteId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, subtitle, content, background")
    .eq("site_id", siteId)
    .eq("type", "contact")
    .limit(1)
    .maybeSingle();

  console.log("[fetchContactSection] fetched section:", data);
  if (error) {
    console.error("[fetchContactSection] supabase error:", error);
    return null;
  }
  return data ?? null;
}
