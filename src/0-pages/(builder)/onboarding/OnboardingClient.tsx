"use client";

import PricingTable from "@/2-features/builder/billing/ui/pricing/PricingTable";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType } from "@/4-shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  translations: Record<string, string>;
  lang: string;
}

export default function OnboardingClient({ translations, lang }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handlePlanSelect(plan: PlanType) {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (plan === "free") {
        const res = await fetch("/api/onboarding/complete", { method: "POST" });
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to complete onboarding");
        }

        /**
         * 1. Refresh the current route to sync Server Component state
         * (e.g., updating the 'onboarded' status in layouts/middleware)
         */
        router.refresh();

        /**
         * 2. Use .replace() so the onboarding page is removed from
         * the browser history. Users can't "back" into onboarding.
         */
        router.replace(`/${lang}/builder`);
      } else {
        // Premium flows go to checkout
        router.push(`/${lang}/builder/checkout?plan=${plan}`);
      }
    } catch (err) {
      console.error("[Onboarding] Error:", err);
      notify.error(
        translations["error.something_went_wrong"] ?? "Something went wrong",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold pb-4 text-gray-900">
            {translations["onboarding.welcome"] ??
              "Welcome to Your Wedding Website"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {translations["onboarding.subtitle"] ??
              "Choose a plan that works for you. Start free and upgrade anytime."}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="mb-12">
          <PricingTable
            translations={translations}
            type="private"
            lang={lang}
            onSelect={handlePlanSelect}
            isLoading={isLoading}
            // Logic note: Ensure PricingTable internal buttons are
            // also disabled if you pass 'isLoading' down.
          />
        </div>

        {/* Free plan info box */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 pb-4">
            {translations["onboarding.free_plan_note"] ??
              "Ready to start free?"}
          </h3>
          <ul className="space-y-3 text-gray-700">
            {[1, 2, 3].map((num) => (
              <li key={num} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>{translations[`onboarding.free_feature_${num}`]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Footer */}
        <div className="text-center mt-12">
          <button
            onClick={() => handlePlanSelect("free")}
            disabled={isLoading}
            className="cursor-pointer text-(--builder-color-primary) hover:text-(--builder-color-primary-hover) font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? (translations["loading"] ?? "Loading...")
              : (translations["onboarding.start_free"] ??
                "Start with Free Plan →")}
          </button>
        </div>
      </div>
    </div>
  );
}
