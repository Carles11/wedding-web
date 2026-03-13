import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { createCheckoutSession } from "@/4-shared/lib/stripe/stripeCheckout";
import type { PlanType } from "@/4-shared/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { success: false, message: "Missing user email for Stripe checkout" },
        { status: 400 },
      );
    }

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

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const subscription = await getCurrentUserSubscription(user.id);

    if (planType === "free") {
      const hasActivePaidPlan =
        !!subscription &&
        subscription.plan_type !== "free" &&
        ["active", "trialing"].includes(subscription.status ?? "");

      if (hasActivePaidPlan) {
        return NextResponse.json(
          {
            success: false,
            code: "DOWNGRADE_NOT_AVAILABLE",
            message:
              "Downgrading from your current paid plan to Free is not available yet. Your current plan remains active.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        success: true,
        planType: "free",
        redirectTo: `/builder?lang=${language}`,
      });
    }

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
