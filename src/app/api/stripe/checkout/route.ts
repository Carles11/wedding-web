import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { createCheckoutSession } from "@/4-shared/lib/stripe/stripeCheckout";
import type { PlanType } from "@/4-shared/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles Stripe Checkout session creation or Free plan redirection.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Auth Validation
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return NextResponse.json(
        {
          success: false,
          message: !user
            ? "Unauthorized"
            : "Missing user email for Stripe checkout",
        },
        { status: !user ? 401 : 400 },
      );
    }

    // 2. Request Validation
    const body = await req.json();
    const { planType, language = "en" } = body as {
      planType?: string;
      language?: string;
    };

    if (!planType || !["free", "premium"].includes(planType)) {
      return NextResponse.json(
        { success: false, message: "Invalid plan type" },
        { status: 400 },
      );
    }

    // 3. Environment & URL Setup
    // Ensure https on production, fallback to host header
    const protocol =
      process.env.NODE_HOST === "production"
        ? "https"
        : req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // 4. Subscription State Check
    const subscription = await getCurrentUserSubscription(user.id);
    const isCurrentlyPaid =
      !!subscription &&
      subscription.plan_type !== "free" &&
      ["active", "trialing"].includes(subscription.status ?? "");

    // 5. Logic: Handle "Free" Plan Request
    if (planType === "free") {
      if (isCurrentlyPaid) {
        return NextResponse.json(
          {
            success: false,
            code: "DOWNGRADE_NOT_AVAILABLE",
            message:
              "Downgrading from your current paid plan to Free is not available yet.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        success: true,
        planType: "free",
        // Consistent with your localized routing
        redirectTo: `/${language}/builder`,
      });
    }

    // 6. Logic: Handle "Premium" Plan Request
    const alreadyPremium =
      subscription?.plan_type === "premium" &&
      ["active", "trialing"].includes(subscription.status ?? "");

    if (alreadyPremium) {
      return NextResponse.json(
        {
          success: false,
          code: "ALREADY_PREMIUM",
          message: "You are already premium.",
        },
        { status: 409 },
      );
    }

    // 7. Create Stripe Session
    const result = await createCheckoutSession(
      user.id,
      user.email,
      planType as PlanType,
      baseUrl,
      language,
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      planType,
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    console.error("[stripe-checkout] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
