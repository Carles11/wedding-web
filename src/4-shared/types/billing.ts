// Plan types must match DB AND Stripe config
export type PlanType = "free" | "pro" | "agency_monthly" | "agency_yearly";
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
