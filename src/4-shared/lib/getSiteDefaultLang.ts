import { supabase } from "@/4-shared/api/supabaseClient";
import type { Site } from "@/4-shared/types";

/**
 * Returns the default language for a given site tenant.
 * If query fails or not present, defaults to 'ca'.
 */
export async function getSiteDefaultLang(siteId: string): Promise<string> {
  if (!siteId) return "ca";
  // Guard against invalid input
  if (!siteId) return "ca";

  // Avoid using `.from<T>()` generics unless DB types are generated and imported.
  const { data, error } = await supabase
    .from("sites")
    .select("default_lang")
    .eq("id", siteId)
    .maybeSingle();

  if (error) {
    console.error("[getSiteDefaultLang] Supabase query error:", error, siteId);
    return "ca";
  }

  // Cast the result to our shared type and return the DB value if present.
  const siteRow = data as Site | null;
  return siteRow?.default_lang ?? "ca";
}
