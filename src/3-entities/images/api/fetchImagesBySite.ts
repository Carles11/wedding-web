import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

export async function fetchImagesBySite(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("images")
    .select("*, section:sections(type)")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    ...(row as ImageRow),
    // Supabase may return joined relation as object or single-item array.
    section: Array.isArray(row.section) ? row.section[0] : row.section,
  })) as Array<ImageRow & { section: string }>;
}
