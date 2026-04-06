import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription.client";
import {
  getPlanFeatures,
  resolvePlanType,
} from "@/4-shared/helpers/billing/entitlements";
import type { PlanType } from "@/4-shared/types";

export { getPlanFeatures, resolvePlanType };

// Top-level: resolve plan for user_id, SSR/CSR as needed
export async function getUserPlan(user_id: string): Promise<PlanType> {
  const sub = await getCurrentUserSubscription(user_id);
  return resolvePlanType(sub);
}
