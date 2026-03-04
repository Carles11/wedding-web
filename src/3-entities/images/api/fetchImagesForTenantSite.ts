"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { ImageRow } from "@/4-shared/types";

export async function fetchImagesForTenantSite(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  const supabase = await createSupabaseSSRClient();

  const query = supabase
    .from("images")
    .select("id, url, caption, site_id, section_id, section:sections(type)")
    .eq("site_id", siteId);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    section: Array.isArray(row.section) ? row.section[0] : row.section,
  })) as Array<ImageRow & { section: string }>;
}
