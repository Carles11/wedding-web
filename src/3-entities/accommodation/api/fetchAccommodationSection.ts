import { supabase } from "@/4-shared/api/supabaseClient";
import type { AccommodationSection } from "@/4-shared/types";

/**
 * Fetch section row of type 'accommodation' for a site.
 */
export async function fetchAccommodationSection(
  siteId: string,
): Promise<AccommodationSection | null> {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, subtitle, content, created_at")
    .eq("site_id", siteId)
    .eq("type", "accommodation")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchAccommodationSection] Supabase error:", error);
    return null;
  }

  return (data as AccommodationSection) ?? null;
}
