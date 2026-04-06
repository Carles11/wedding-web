"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { WeddingGift } from "@/4-shared/types";

/**
 * Fetch the wedding_gift info for the given site (public/tenant).
 */
export async function fetchWeddingGiftSectionDataForTenant(
  siteId: string,
): Promise<WeddingGift | null> {
  if (!siteId) return null;
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("wedding_gift")
    .select("*")
    .eq("site_id", siteId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "[fetchWeddingGiftSectionDataForTenant] supabase error:",
      error,
    );
    return null;
  }

  return data as WeddingGift | null;
}
