"use client";

// import { completeOnboarding } from "@/2-features/auth/api/completeOnboarding";
import PricingTable from "@/2-features/builder/billing/ui/pricing/PricingTable";
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
    setIsLoading(true);

    try {
      console.log("[Onboarding] Plan selected:", plan);
      if (plan === "free") {
        console.log("[Onboarding] Calling /api/onboarding/complete...");
        const res = await fetch("/api/onboarding/complete", { method: "POST" });
        console.log("[Onboarding] API response status:", res.status);
        const data = await res.json();
        console.log("[Onboarding] API response data:", data);
        if (!data.success) {
          console.error(
            "[Onboarding] Failed to complete onboarding:",
            data.error,
          );
          throw new Error(data.error || "Failed to complete onboarding");
        }
        console.log(
          "[Onboarding] Onboarding marked complete. Redirecting to /" +
            lang +
            "/builder",
        );
        window.location.href = `/${lang}/builder`;
      } else {
        console.log("[Onboarding] Redirecting to checkout for plan:", plan);
        router.push(`/${lang}/builder/checkout?plan=${plan}`);
      }
    } catch (err) {
      // Optionally, show error notification here
      console.error("[Onboarding] Error in handlePlanSelect:", err);
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
              "Welcomes to Your Wedding Website"}
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
            lang={lang}
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
            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
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
