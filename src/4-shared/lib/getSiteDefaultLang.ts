import { supabase } from "@/4-shared/api/supabaseClient";

// Get site's default language
export async function getSiteDefaultLang(siteId: string): Promise<string> {
  if (!siteId) return "ca";
  const { data, error } = await supabase
    .from("sites")
    .select("default_lang")
    .eq("id", siteId)
    .single();
  if (error) {
    console.error("[getSiteDefaultLang] Supabase error:", error, siteId);
    return "ca";
  }
  return data?.default_lang ?? "ca";
}
