import { PLAN_DEFINITIONS } from "@/4-shared/config/plans/planDefinitions";
import { cache } from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getStripePrices = cache(async () => {
  const plans = Object.entries(PLAN_DEFINITIONS);

  const results = await Promise.all(
    plans.map(async ([key, plan]) => {
      const price = await stripe.prices.retrieve(plan.stripePriceId);

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
