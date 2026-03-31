import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import type { PlanFeatures, PlanType, Subscription } from "@/4-shared/types";

export type PlanLimitKey = keyof (typeof PLAN_CATALOG)["free"]["limits"];

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
  return PLAN_CATALOG[planType] ?? PLAN_CATALOG.free;
}

export function getPlanFeatures(planType: PlanType): PlanFeatures {
  const def = getPlanDefinition(planType);
  return {
    description: def?.description,
    featuresList: [...(def?.featuresList ?? [])],
    limits: { ...(def?.limits ?? {}) },
  };
}

function resolveTranslationByKeys(
  translations: Record<string, string>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = translations[key];
    if (value) return value;
  }
  return undefined;
}

export function getLocalizedPlanFeatureTitles(
  planType: PlanType,
  translations: Record<string, string>,
): string[] {
  const def = getPlanDefinition(planType);
  return def.features.map(
    (feature) =>
      resolveTranslationByKeys(translations, feature.titleTranslationKeys) ??
      feature.title,
  );
}

export function getLocalizedMarketingPlanFeatures(
  planType: PlanType,
  translations: Record<string, string>,
): Array<{ title: string; description: string }> {
  const def = getPlanDefinition(planType);
  return def.features.map((feature) => ({
    title:
      resolveTranslationByKeys(translations, feature.titleTranslationKeys) ??
      feature.title,
    description:
      translations[feature.marketingDescriptionTranslationKey] ??
      feature.marketingDescription,
  }));
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
