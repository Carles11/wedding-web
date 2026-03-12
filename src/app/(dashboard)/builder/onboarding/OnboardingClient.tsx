"use client";

import { completeOnboarding } from "@/2-features/auth/api/completeOnboarding";
import PricingTable from "@/2-features/builder/billing/ui/pricing/PricingTable";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType } from "@/4-shared/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  translations: Record<string, string>;
}

export default function OnboardingClient({ translations }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLang = searchParams.get("lang") ?? undefined;
  const currentLang = isValidLanguage(requestedLang) ? requestedLang : "en";
  const langQuery = `lang=${encodeURIComponent(currentLang)}`;
  const [isLoading, setIsLoading] = useState(false);

  async function handlePlanSelect(plan: PlanType) {
    setIsLoading(true);

    try {
      // Mark onboarding as complete
      await completeOnboarding();

      // Route based on plan selection
      if (plan === "free") {
        // Go straight to builder
        router.push(`/builder?onboarding=completed&${langQuery}`);
      } else {
        // Go to checkout for premium/paid plans
        router.push(`/builder/checkout?plan=${plan}&${langQuery}`);
      }
    } catch (err) {
      console.error("Onboarding error:", err);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {translations["onboarding.welcome"] ??
              "Welcome to Your Wedding Website"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {translations["onboarding.subtitle"] ??
              "Choose a plan that works for you. Start free and upgrade anytime as you add more features."}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="mb-12">
          <PricingTable
            translations={translations}
            type="private"
            lang={currentLang}
            onSelect={handlePlanSelect}
          />
        </div>

        {/* Free plan info */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {translations["onboarding.free_plan_note"] ??
              "Ready to start free?"}
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                {translations["onboarding.free_feature_1"] ??
                  "Create your beautiful wedding website with your custom subdomain"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                {translations["onboarding.free_feature_2"] ??
                  "Upgrade to premium anytime to unlock more features"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                {translations["onboarding.free_feature_3"] ??
                  "Add upgrade prompts at key moments when you need them"}
              </span>
            </li>
          </ul>
        </div>

        {/* Skip button - only for free plan */}
        <div className="text-center mt-12">
          <button
            onClick={() => handlePlanSelect("free")}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
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
