import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

/**
 * Fetch the 'bank_data' section row for a given site.
 */
export async function fetchBankDataSection(siteId: string) {
  if (!siteId) return null;
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, subtitle, content, background")
    .eq("site_id", siteId)
    .eq("type", "bank_data")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchBankDataSection] supabase error:", error);
    return null;
  }
  return data ?? null;
}
