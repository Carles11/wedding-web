import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription.client";
import { PLAN_DEFINITIONS } from "@/4-shared/config/plans/planDefinitions";
import type { PlanType, Subscription } from "@/4-shared/types";

// Resolves the full plan type from subscription (expand as you add more plans)
export function resolvePlanType(
  data: Subscription | PlanType | null,
): PlanType {
  if (!data) return "free";

  if (typeof data === "string") {
    // TODO(agencies): restore agency_monthly / agency_yearly branches when launching agency tier
    if (data === "premium") return "premium";
    return "free";
  }

  // TODO(agencies): restore agency_monthly / agency_yearly branches when launching agency tier
  if (
    ["active", "trialing"].includes(data.status) &&
    data.plan_type === "premium"
  )
    return "premium";
  return "free";
}

// Top-level: resolve plan for user_id, SSR/CSR as needed
export async function getUserPlan(user_id: string): Promise<PlanType> {
  // Get full subscription object
  const sub = await getCurrentUserSubscription(user_id);
  // old getCurrentUserSubscription can also return the full Subscription object, preferred for flexibility/SSR
  return resolvePlanType(sub);
}

// Optionally fetch plan feature set
export function getPlanFeatures(planType: PlanType) {
  return PLAN_DEFINITIONS[planType];
}
