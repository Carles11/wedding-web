"use server";

import { updateUserProfile } from "@/3-entities/user/api/updatedUserProfile";
import { upsertCurrentUserSubscription } from "@/3-entities/user/api/upsertCurrentUserSubscription";
import { resolvePlanTypeFromStripePriceId } from "@/4-shared/lib/stripe/stripeCheckout";
import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "@/4-shared/lib/stripe/stripeConfig";
import type { PlanType } from "@/4-shared/types";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * STRIPE WEBHOOK HANDLER
 * Processes asynchronous events from Stripe (Payments, Subscriptions, etc.)
 */
export async function POST(req: NextRequest) {
  const webhookSecret = STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook] Error: WEBHOOK_SECRET is not defined.");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // 1. Verify the event came from Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`[Stripe Webhook] Signature verification failed: ${msg}`);
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // 2. Route the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      // Optional: Add more cases here as you scale (e.g., invoice.payment_failed)
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error(
      "[Stripe Webhook] Missing userId in session metadata:",
      session.id,
    );
    return;
  }

  // Verification check: Only process if paid
  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    console.warn("[Stripe Webhook] Session not paid:", session.id);
    return;
  }

  // Fetch line items to get the Price ID and amount
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const firstItem = lineItems.data[0];
  const stripePriceId = firstItem?.price?.id ?? null;

  // Determine Plan Type
  const planType: PlanType =
    (session.metadata?.planType as PlanType | undefined) ??
    resolvePlanTypeFromStripePriceId(stripePriceId) ??
    "premium";

  // Construct the payload for our DB
  const subscriptionPayload = {
    user_id: userId,
    plan_type: planType,
    status: "active" as const,
    price_amount: (firstItem?.price?.unit_amount ?? 0) / 100,
    currency: (
      firstItem?.price?.currency ??
      session.currency ??
      "EUR"
    ).toUpperCase(),
    started_at: new Date().toISOString(),
    stripe_customer_id:
      typeof session.customer === "string" ? session.customer : null,
    stripe_subscription_id: null, // null for 'payment' mode (one-time)
    stripe_price_id: stripePriceId,
    updated_at: new Date().toISOString(),
  };

  /**
   * UPSERT LOGIC
   * We use .upsert() targeting 'user_id' to ensure a user only ever has
   * one active subscription record in the table.
   */
  const { error } = await upsertCurrentUserSubscription(subscriptionPayload);

  if (error) {
    // This log will now contain the actual Postgrest error message
    console.error("[Stripe Webhook] DB Update Error:", error.message);

    // Re-throwing tells Stripe "I failed, try again in an hour"
    throw new Error(`Database Upsert Failed: ${error.message}`);
  }

  // Mark onboarding as complete for this user (for premium signups)

  const { data: updatedProfile, error: onboardingError } =
    await updateUserProfile(userId, { onboarding_completed: true });

  if (onboardingError) {
    console.error(
      "[Stripe Webhook] Failed to update profile:",
      onboardingError,
    );
  } else {
    console.log(
      "[Stripe Webhook] Profile updated successfully:",
      updatedProfile,
    );
  }

  console.log(
    `[Stripe Webhook] Successfully activated ${planType} for user ${userId}`,
  );
}
