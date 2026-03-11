"use client";
import { usePlan } from "@/app/providers";

export default function AccountBillingDetails({
  t,
}: {
  t: Record<string, string>;
}) {
  const { planType, features, subscription } = usePlan();

  return (
    <div className="space-y-4">
      <p>
        {t["billing.subscription_type"] ?? "Current Plan"}:{" "}
        <span className="font-semibold capitalize">
          {planType ?? t["billing.none"] ?? "None"}
        </span>
      </p>
      {/* Show more info, usage stats, or plan features here */}
    </div>
  );
}
