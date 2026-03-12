import { PLAN_DEFINITIONS } from "@/4-shared/config/plans/planDefinitions";
import type { PlanFeatures, PlanType, Subscription } from "@/4-shared/types";

export type PlanLimitKey = keyof (typeof PLAN_DEFINITIONS)["free"]["limits"];

export function resolvePlanType(
  data: Subscription | PlanType | null,
): PlanType {
  if (!data) return "free";

  if (typeof data === "string") {
    return data === "premium" ? "premium" : "free";
  }

  if (!data.plan_type || !["active", "trialing"].includes(data.status)) {
    return "free";
  }

  return data.plan_type === "premium" ? "premium" : "free";
}

export function getPlanDefinition(planType: PlanType) {
  return PLAN_DEFINITIONS[planType] ?? PLAN_DEFINITIONS.free;
}

export function getPlanFeatures(planType: PlanType): PlanFeatures {
  const def = getPlanDefinition(planType);
  return {
    description: def.description,
    featuresList: [...def.featuresList],
    limits: { ...def.limits },
  };
}

export function getPlanLimit(planType: PlanType, key: PlanLimitKey): number {
  return getPlanDefinition(planType).limits[key];
}

export function canUseQuota(
  planType: PlanType,
  key: PlanLimitKey,
  currentCount: number,
): boolean {
  const limit = getPlanLimit(planType, key);
  return limit === -1 || currentCount < limit;
}
