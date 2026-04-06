import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import type { PlanType } from "@/4-shared/types";
import { cache } from "react";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, getStripePriceIdForPlan } from "./stripeConfig";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const getStripePrices = cache(async () => {
  const plans = Object.entries(PLAN_CATALOG);

  const results = await Promise.all(
    plans.map(async ([key]) => {
      const priceId = getStripePriceIdForPlan(key as PlanType);
      const price = await stripe.prices.retrieve(priceId);

      return {
        planKey: key,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval ?? null,
      };
    }),
  );

  return Object.fromEntries(
    results.map((p) => [
      p.planKey,
      {
        amount: p.amount,
        currency: p.currency,
        interval: p.interval,
      },
    ]),
  );
});
