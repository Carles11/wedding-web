"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { WhatToSeeEntryFull } from "@/4-shared/types";

/**
 * Fetch all 'what to see' (attractions, activities) entries for a tenant/site.
 * These are meant for public display and are SSR/SSG safe.
 * All translations are fetched in the parent and passed down.
 */
export async function fetchWhatToSeeDataForTenant(
  siteId: string,
): Promise<WhatToSeeEntryFull[]> {
  if (!siteId) return [];
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("what_to_see")
    .select("id, site_id, location_url, sort_order, created_at, updated_at")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[fetchWhatToSeeDataForTenant] supabase error:", error);
    return [];
  }
  return data ?? [];
}
