import { countWeddingGiftMethods } from "@/4-shared/helpers/billing/countWeddingGiftMethods";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { createClient } from "@/4-shared/lib/supabase/client";
import type { PlanType, WeddingGift } from "@/4-shared/types";

/**
 * Creates a new wedding_gift row for the given site.
 * Returns the full row or throws on error.
 */
export async function createWeddingGiftBySite(
  siteId: string,
  data: Partial<WeddingGift> = {},
  planType: PlanType = "free",
): Promise<WeddingGift> {
  if (!siteId) throw new Error("Missing siteId");

  const methodLimit = getPlanLimit(planType, "weddingGiftMethods");
  const methodsCount = countWeddingGiftMethods(data);
  if (methodLimit !== -1 && methodsCount > methodLimit) {
    throw new Error(`Wedding gift limit reached (${methodLimit} method).`);
  }

  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("wedding_gift")
    .insert([{ site_id: siteId, ...data }])
    .select("*")
    .maybeSingle();

  if (error || !rows) throw new Error(error?.message ?? "Insert failed");
  return rows;
}
