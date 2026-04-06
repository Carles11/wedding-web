import { canUseQuota } from "@/4-shared/helpers/billing/entitlements";
import { createClient } from "@/4-shared/lib/supabase/client";
import type {
  AccommodationEntry,
  AccommodationFormValues,
  PlanType,
} from "@/4-shared/types";

export async function createAccommodationEntry(
  siteId: string,
  entry: AccommodationFormValues,
  planType: PlanType = "free",
): Promise<AccommodationEntry | null> {
  if (!siteId) return null;
  const supabase = await createClient();
  const { data: existingRows, error: fetchError } = await supabase
    .from("accommodations")
    .select("id")
    .eq("site_id", siteId);

  if (fetchError) {
    console.error(
      "[createAccommodationEntry] supabase fetch error:",
      fetchError,
    );
    return null;
  }

  if (!canUseQuota(planType, "accommodations", existingRows?.length ?? 0)) {
    return null;
  }

  const { data, error } = await supabase
    .from("accommodations")
    .insert([{ site_id: siteId, ...entry }])
    .select(
      "id, site_id, name, address, notes, website, phone, email, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("[createAccommodationEntry] supabase insert error:", error);
    return null;
  }
  return data as AccommodationEntry;
}
