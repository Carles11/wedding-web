"use client";

import { getPlanFeatures } from "@/3-entities/user/billing/plan";
import type {
  PlanContextProps,
  PlanType,
  Subscription,
} from "@/4-shared/types";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

const PlanContext = createContext<PlanContextProps>({
  planType: "free",
  subscription: null,
  features: getPlanFeatures("free"),
  usage: null,
  lastInvoice: null,
});

export const PlanProvider = ({
  children,
  subscription,
}: {
  children: ReactNode;
  subscription: Subscription | null;
}) => {
  const planType: PlanType = subscription
    ? (subscription.plan_type as PlanType)
    : "free";
  const features = useMemo(() => getPlanFeatures(planType), [planType]);

  return (
    <PlanContext.Provider
      value={{
        planType,
        subscription,
        features,
        usage: null,
        lastInvoice: null,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export function usePlan() {
  return useContext(PlanContext);
}
