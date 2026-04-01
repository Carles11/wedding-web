import type { PlanType } from "@/4-shared/types";
import "server-only";

type StripeMode = "live" | "test";

function shouldUseTestStripeMode(): boolean {
  // 1. Manual override - check for BOTH string and boolean-like values
  const forced = process.env.STRIPE_USE_TEST_KEYS;
  if (forced === "true") return true;
  if (forced === "false") return false;

  // 2. Vercel System Variable
  const vercelEnv = process.env.VERCEL_ENV;

  // 3. NODE_ENV Check (Fallback if VERCEL_ENV is missing)
  const isProdNode = process.env.NODE_ENV === "production";

  // LOGGING: This will show up in your Vercel Function Logs!

  // If we are definitely in Vercel Production, use Live.
  if (vercelEnv === "production") return false;

  // If we are in a Preview deployment (beta-deploy), VERCEL_ENV will be "preview"
  if (vercelEnv === "preview") return true;

  // If Vercel env is missing, rely on NODE_ENV
  return !isProdNode;
}

export const STRIPE_MODE: StripeMode = shouldUseTestStripeMode()
  ? "test"
  : "live";

function readScopedEnv(
  liveKey: keyof NodeJS.ProcessEnv,
  testKey: keyof NodeJS.ProcessEnv,
  options: { required?: boolean; allowEmpty?: boolean } = {},
): string | undefined {
  const { required = true, allowEmpty = false } = options;

  const primaryKey = STRIPE_MODE === "test" ? testKey : liveKey;
  const value = process.env[primaryKey];

  if (value === undefined) {
    if (!required) return undefined;

    throw new Error(
      `[stripe] Missing environment variable: ${String(primaryKey)}`,
    );
  }

  if (!allowEmpty && value.trim() === "") {
    if (!required) return undefined;

    throw new Error(
      `[stripe] Environment variable cannot be empty: ${String(primaryKey)}`,
    );
  }

  return value;
}

export const STRIPE_SECRET_KEY = readScopedEnv(
  "STRIPE_SECRET_KEY",
  "STRIPE_SECRET_KEY_TEST",
) as string;

export const STRIPE_WEBHOOK_SECRET = readScopedEnv(
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_WEBHOOK_SECRET_TEST",
  { required: false },
);

const STRIPE_PRICE_ID_BY_PLAN = {
  free: readScopedEnv(
    "STRIPE_PRICE_ID_FREE",
    "STRIPE_PRICE_ID_FREE_TEST",
  ) as string,
  premium: readScopedEnv(
    "STRIPE_PRICE_ID_PREMIUM",
    "STRIPE_PRICE_ID_PREMIUM_TEST",
  ) as string,
} as const;

export function getStripePriceIdForPlan(planType: PlanType): string {
  if (planType in STRIPE_PRICE_ID_BY_PLAN) {
    return STRIPE_PRICE_ID_BY_PLAN[
      planType as keyof typeof STRIPE_PRICE_ID_BY_PLAN
    ];
  }

  throw new Error(
    `[stripe] Unsupported plan type for Stripe price ID: ${planType}`,
  );
}
