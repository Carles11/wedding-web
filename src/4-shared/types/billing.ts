// Plan types must match DB AND Stripe config
import { PLAN_DEFINITIONS } from "@/4-shared/config/plans/planDefinitions";

const PLAN_TYPES = Object.keys(PLAN_DEFINITIONS) as Array<
  keyof typeof PLAN_DEFINITIONS
>;

export type PlanType = (typeof PLAN_TYPES)[number];

export type UserSubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface Subscription {
  plan_type: PlanType;
  status: UserSubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  started_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  canceled_at?: string;
}
