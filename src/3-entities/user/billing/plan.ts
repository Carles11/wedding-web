import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription.client";
import { PLAN_DEFINITIONS } from "@/4-shared/config/plans/planDefinitions";
import type { PlanFeatures, PlanType, Subscription } from "@/4-shared/types";

// Resolves the full plan type from subscription (expand as you add more plans)
export function resolvePlanType(
  data: Subscription | PlanType | null,
): PlanType {
  if (!data) return "free";

  if (typeof data === "string") {
    if (data === "agency_monthly") return "agency_monthly";
    if (data === "agency_yearly") return "agency_yearly";
    if (data === "premium") return "premium";
    return "free";
  }

  if (!["active", "trialing"].includes(data.status)) return "free";

  switch (data.plan_type) {
    case "agency_monthly":
      return "agency_monthly";
    case "agency_yearly":
      return "agency_yearly";
    case "premium":
      return "premium";
    default:
      return "free";
  }
}

// Top-level: resolve plan for user_id, SSR/CSR as needed
export async function getUserPlan(user_id: string): Promise<PlanType> {
  // Get full subscription object
  const sub = await getCurrentUserSubscription(user_id);
  // old getCurrentUserSubscription can also return the full Subscription object, preferred for flexibility/SSR
  return resolvePlanType(sub);
}

// Optionally fetch plan feature set
export function getPlanFeatures(planType: PlanType): PlanFeatures {
  // You can extract just the UI parts if you prefer
  const def = PLAN_DEFINITIONS[planType];
  return {
    description: def.description,
    featuresList: def.featuresList,
    limits: def.limits,
  };
}
