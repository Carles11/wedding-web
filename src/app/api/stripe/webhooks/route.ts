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

  // 1. Verification check
  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    console.warn("[Stripe Webhook] Session not paid:", session.id);
    return;
  }

  // 2. Data Resolution
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const firstItem = lineItems.data[0];
  const stripePriceId = firstItem?.price?.id ?? null;

  const planType: PlanType =
    (session.metadata?.planType as PlanType | undefined) ??
    resolvePlanTypeFromStripePriceId(stripePriceId) ??
    "premium";

  // 3. Database Updates
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
    stripe_subscription_id: null,
    stripe_price_id: stripePriceId,
    updated_at: new Date().toISOString(),
  };

  // Try Sub Update
  const { error: subError } =
    await upsertCurrentUserSubscription(subscriptionPayload);
  if (subError) {
    console.error("[Stripe Webhook] DB Subscription Error:", subError);
    // We continue even if DB fails so we at least try to track the money in GA4
  }

  // Try Profile Update
  const { error: onboardingError } = await updateUserProfile(userId, {
    onboarding_completed: true,
  });
  if (onboardingError) {
    console.error("[Stripe Webhook] Profile Update Error:", onboardingError);
  }

  // 4. GA4 Purchase Tracking (Isolated so it won't crash the webhook)
  try {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const gaSecret = process.env.GA_API_SECRET;

    if (gaId && gaSecret) {
      await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${gaId}&api_secret=${gaSecret}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: userId,
            user_id: userId,
            events: [
              {
                name: "purchase",
                params: {
                  transaction_id: session.id,
                  // Use amount_total for the actual money paid (will be 0 for your discount test)
                  value: (session.amount_total ?? 0) / 100,
                  currency: session.currency?.toUpperCase() || "EUR",
                  items: [
                    {
                      item_id: planType,
                      item_name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
                      price: (session.amount_total ?? 0) / 100,
                      quantity: 1,
                    },
                  ],
                },
              },
            ],
          }),
        },
      );
      console.log("[Stripe Webhook] GA4 Purchase tracked successfully");
    } else {
      console.warn(
        "[Stripe Webhook] GA4 credentials missing in environment variables",
      );
    }
  } catch (e) {
    console.error("[Stripe Webhook] GA4 Tracking Error:", e);
  }

  console.log(`[Stripe Webhook] Processed ${planType} for user ${userId}`);
}
