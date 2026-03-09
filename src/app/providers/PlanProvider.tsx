"use client";

import { getPlanFeatures } from "@/4-shared/billing/plan";
import type { PlanType, Subscription } from "@/4-shared/types";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

interface PlanContextProps {
  planType: PlanType;
  subscription: Subscription | null;
  features: unknown;
}

const PlanContext = createContext<PlanContextProps>({
  planType: "free",
  subscription: null,
  features: getPlanFeatures("free"),
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
    <PlanContext.Provider value={{ planType, subscription, features }}>
      {children}
    </PlanContext.Provider>
  );
};

export function usePlan() {
  return useContext(PlanContext);
}
