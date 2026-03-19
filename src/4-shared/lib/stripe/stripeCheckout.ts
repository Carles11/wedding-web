import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import type { PlanType } from "@/4-shared/types";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, getStripePriceIdForPlan } from "./stripeConfig";

const stripe = new Stripe(STRIPE_SECRET_KEY);

type CheckoutSessionResult = { sessionId: string; url: string };

/**
 * Get the Stripe price ID for a given plan type.
 */
export function getPriceIdForPlan(planType: PlanType): string {
  const plan = PLAN_CATALOG[planType];
  if (!plan) throw new Error(`Unknown plan type: ${planType}`);
  return getStripePriceIdForPlan(planType);
}

/**
 * Resolve internal plan type from Stripe price ID.
 */
export function resolvePlanTypeFromStripePriceId(
  priceId: string | null | undefined,
): PlanType | null {
  if (!priceId) return null;

  const planTypes = Object.keys(PLAN_CATALOG) as PlanType[];

  for (const planType of planTypes) {
    try {
      if (getStripePriceIdForPlan(planType) === priceId) {
        return planType;
      }
    } catch {
      // Ignore non-Stripe plans until they are explicitly mapped.
    }
  }

  return null;
}

/**
 * Create a Stripe checkout session for the given user and plan.
 *
 * For FREE plan: returns null (no session needed)
 * For PREMIUM plan: creates and returns Stripe checkout session
 *
 * @param userId - Authenticated user ID
 * @param email - User's email for Stripe customer reference
 * @param planType - "free" or "premium"
 * @param baseUrl - Base URL for success/cancel redirects (e.g., https://weddweb.com)
 * @param language - Language code for redirect URLs
 *
 * @returns { sessionId: string; url: string } or null for free plan
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  planType: PlanType,
  baseUrl: string,
  language: string = "en",
): Promise<CheckoutSessionResult | null> {
  // Free plan doesn't need Stripe
  if (planType === "free") {
    return null;
  }

  const priceId = getPriceIdForPlan(planType);

  // Create one-time checkout session for MVP premium purchases.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    customer_creation: "always",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      planType,
    },
    success_url: `${baseUrl}/${language}/builder/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${language}/pricing`,
  });

  if (!session.id || !session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Retrieve the status of a Stripe checkout session.
 * Used to verify payment after redirect from Stripe.
 *
 * @param sessionId - Stripe checkout session ID
 * @returns Session details including payment status and customer ID
 */
export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    id: session.id,
    payment_status: session.payment_status, // "paid", "unpaid", "no_payment_required"
    customer_id: session.customer as string | null,
    customer_email: session.customer_email,
    metadata: session.metadata,
    amountTotal: session.amount_total,
    currency: session.currency,
    createdAt: new Date(session.created * 1000),
  };
}

/**
 * Get or create a Stripe customer for a user.
 * Useful for tracking subscriptions and payment history.
 *
 * @param email - User's email
 * @param metadata - Additional metadata (e.g., { userId: "..." })
 */
export async function getOrCreateStripeCustomer(
  email: string,
  metadata?: Record<string, string>,
) {
  // Search for existing customer by email
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    metadata,
  });
}

/**
 * Helper to verify a payment was successful before updating DB.
 * Returns true if session payment_status is "paid" or "no_payment_required".
 */
export function isPaymentSuccessful(
  paymentStatus: string,
  planType: PlanType,
): boolean {
  // Free plans don't require payment
  if (planType === "free") return true;

  // Premium requires payment
  return paymentStatus === "paid" || paymentStatus === "no_payment_required";
}
