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
  plan_type: PlanType | null;
  status: UserSubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  started_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  canceled_at?: string;
  renewalDate?: string;
}

export interface PlanContextProps {
  planType: PlanType;
  subscription: Subscription | null;
  features: PlanFeatures;
  usage?: UsageData | null; // <-- Add but leave undefined/null for now
  lastInvoice?: Invoice | null; // <-- Add but leave undefined/null for now
}

export interface PlanLimits {
  images?: number;
  accommodations?: number;
  events?: number;
  whatToSee?: number;
  languages?: number;
  customDomains?: number;
}

export interface PlanFeatures {
  description: string;
  featuresList: string[];
  limits?: PlanLimits;
}

export interface UsageData {
  events: number;
  // add other usage metrics here
}

export interface Invoice {
  date: string;
  amount: string;
  currency: string;
  downloadUrl: string;
}
