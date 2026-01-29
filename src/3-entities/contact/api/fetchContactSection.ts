import { supabase } from "@/4-shared/api/supabaseClient";
import type { ContactSection } from "@/4-shared/types";

export async function fetchContactSection(
  siteId: string,
): Promise<ContactSection | null> {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, content, created_at")
    .eq("site_id", siteId)
    .eq("type", "contact")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchContactSection] Supabase error:", error);
    return null;
  }

  return (data as ContactSection) ?? null;
}
