"use client";

import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription.client";
import { resolvePlanType } from "@/4-shared/helpers/billing/plan";
import { createClient } from "@/4-shared/lib/supabase/client";
import type { PlanType, Subscription } from "@/4-shared/types";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { useEffect, useState } from "react";

export function TenantFooter() {
  const [planType, setPlanType] = useState<PlanType>("free");
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function checkUserAndPlan() {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        if (!cancelled) {
          setPlanType("free");
          setUserChecked(true);
        }
        return;
      }
      // Logged in—fetch subscription
      const subscription: Subscription | null =
        await getCurrentUserSubscription(user.id);
      const userPlanType: PlanType = resolvePlanType(subscription);
      if (!cancelled) {
        setPlanType(userPlanType);
        setUserChecked(true);
      }
    }
    checkUserAndPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!userChecked) return null; // Or a spinner if you like

  if (planType === "free") {
    return (
      <Footer
        siteName="Weddweb.com"
        author="Carles del Río Francés"
        repoUrl="https://www.rio-frances.com"
      />
    );
  }
  return null;
}
