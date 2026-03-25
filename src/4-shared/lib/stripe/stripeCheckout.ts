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
  if (!plan) throw new Error(`[Stripe] Unknown plan type: ${planType}`);
  return getStripePriceIdForPlan(planType);
}

/**
 * Resolve internal plan type from Stripe price ID.
 * Useful for webhooks where you only have the price ID.
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
      continue; // Skip plans not mapped in stripeConfig
    }
  }

  return null;
}

/**
 * Create a Stripe checkout session.
 * For "free" plan, it returns null as no Stripe interaction is needed.
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  planType: PlanType,
  baseUrl: string,
  language: string = "en",
): Promise<CheckoutSessionResult | null> {
  if (planType === "free") return null;

  const priceId = getPriceIdForPlan(planType);

  // We use customer_email so Stripe pre-fills the checkout page.
  // We set customer_creation to 'always' to ensure we get a Customer ID in the webhook.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
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
    // Adding the language to the success URL ensures the user returns to the right UI
    success_url: `${baseUrl}/${language}/builder/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${language}/pricing`,
  });

  if (!session.id || !session.url) {
    throw new Error("[Stripe] Failed to create checkout session");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Retrieve session details to verify payment status.
 */
export async function getCheckoutSessionStatus(sessionId: string) {
  try {
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
  } catch (error) {
    console.error("[Stripe] Session retrieval error:", error);
    throw error;
  }
}

/**
 * Find or create a Stripe customer.
 */
export async function getOrCreateStripeCustomer(
  email: string,
  metadata?: Record<string, string>,
) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    const customer = customers.data[0];
    // Sync metadata if provided
    if (metadata) {
      await stripe.customers.update(customer.id, { metadata });
    }
    return customer;
  }

  return stripe.customers.create({
    email,
    metadata,
  });
}

/**
 * Boolean helper for payment success.
 */
export function isPaymentSuccessful(
  paymentStatus: string,
  planType: PlanType,
): boolean {
  if (planType === "free") return true;
  return paymentStatus === "paid" || paymentStatus === "no_payment_required";
}
