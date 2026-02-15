import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Fetch the 'bank_data' section row for a given site.
 */
export async function fetchBankDataSection(siteId: string) {
  if (!siteId) return null;
  const { data, error } = await supabaseAdmin
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
