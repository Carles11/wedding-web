import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
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

    if (planType === "free") {
      return NextResponse.json({
        success: true,
        planType: "free",
        redirectTo: `/builder?lang=${language}`,
      });
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