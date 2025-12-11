import { supabase } from "@/4-shared/api/supabaseClient";

/**
 * Returns the default language for a given site tenant.
 * If query fails or not present, defaults to 'ca'.
 */
export async function getSiteDefaultLang(siteId: string): Promise<string> {
  if (!siteId) return "ca";
  const { data, error } = await supabase
    .from("sites")
    .select("default_lang")
    .eq("id", siteId)
    .single();

  if (error) {
    console.error("[getSiteDefaultLang] Supabase query error:", error, siteId);
    return "ca";
  }

  // Use DB value, fallback to 'ca'
  return data?.default_lang ?? "ca";
}
