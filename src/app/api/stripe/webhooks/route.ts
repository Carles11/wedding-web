"use server";

import { resolvePlanTypeFromStripePriceId } from "@/4-shared/lib/stripe/stripeCheckout";
import {
  STRIPE_MODE,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "@/4-shared/lib/stripe/stripeConfig";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type { PlanType } from "@/4-shared/types";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const webhookSecret = STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      `[stripe-webhook] Webhook secret not configured for ${STRIPE_MODE} mode`,
    );
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (error) {
      console.error("[stripe-webhook] Signature verification failed:", error);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[stripe-webhook] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.warn(
      "[stripe-webhook] Missing userId in session metadata",
      session.id,
    );
    return;
  }

  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const firstItem = lineItems.data[0];

  const stripePriceId = firstItem?.price?.id ?? null;
  const planType: PlanType =
    (session.metadata?.planType as PlanType | undefined) ??
    resolvePlanTypeFromStripePriceId(stripePriceId) ??
    "premium";

  const { data: existingRows, error: selectError } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (selectError) {
    throw selectError;
  }

  const payload = {
    user_id: userId,
    plan_type: planType,
    status: "active",
    price_amount: (firstItem?.price?.unit_amount ?? 0) / 100 || 0,
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

  const existing = existingRows?.[0];
  if (existing) {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert([payload]);

  if (insertError) {
    throw insertError;
  }
}
