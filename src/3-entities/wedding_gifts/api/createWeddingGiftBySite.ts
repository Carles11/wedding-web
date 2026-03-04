import { createClient } from "@/4-shared/lib/supabase/client";
import type { WeddingGift } from "@/4-shared/types";

/**
 * Creates a new wedding_gift row for the given site.
 * Returns the full row or throws on error.
 */
export async function createWeddingGiftBySite(
  siteId: string,
  data: Partial<WeddingGift> = {},
): Promise<WeddingGift> {
  if (!siteId) throw new Error("Missing siteId");
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("wedding_gift")
    .insert([{ site_id: siteId, ...data }])
    .select("*")
    .maybeSingle();

  if (error || !rows) throw new Error(error?.message ?? "Insert failed");
  return rows;
}
