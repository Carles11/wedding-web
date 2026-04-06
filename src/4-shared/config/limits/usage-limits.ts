import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import type { PlanType } from "@/4-shared/types/billing";

export type LimitKey = keyof (typeof PLAN_CATALOG)["free"]["limits"];

export function getPlanLimit(plan: PlanType, limit: LimitKey): number {
  const def = PLAN_CATALOG[plan] ?? PLAN_CATALOG.free;
  return def.limits[limit];
}

export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

export const FREE_IMAGE_LIMIT = getPlanLimit("free", "images");
export const FREE_ACCOMMODATION_LIMIT = getPlanLimit("free", "accommodations");
export const FREE_EVENT_LIMIT = getPlanLimit("free", "events");
export const FREE_WHATTOSEE_LIMIT = getPlanLimit("free", "whatToSee");
export const FREE_WEDDING_GIFT_METHODS_LIMIT = getPlanLimit(
  "free",
  "weddingGiftMethods",
);
export const FREE_LANGUAGES_LIMIT = getPlanLimit("free", "languages");
export const FREE_CUSTOM_DOMAIN_LIMIT = getPlanLimit("free", "customDomains");
