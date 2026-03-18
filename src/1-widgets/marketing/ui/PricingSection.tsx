"use client";

import { PricingSectionProps } from "@/4-shared/types";
import { CheckIcon } from "@/4-shared/ui/commons/icons/checkIcon";
import { MarketingButton } from "@/4-shared/ui/marketing";

/**
 * Props for PricingSection
 *
 * @prop sectionTitle - Title for the pricing section
 * @prop freePlanName - Display name for the free plan
 * @prop freePlanPrice - Price string for the free plan
 * @prop freePlanCTA - CTA text for the free plan button
 * @prop freePlanFeatures - Feature list for the free plan (array of 4 strings)
 * @prop premiumPlanName - Display name for the premium plan
 * @prop premiumPlanPrice - Price string for the premium plan
 * @prop premiumPlanCTA - CTA text for the premium plan button
 * @prop premiumPlanFeatures - Feature list for the premium plan (array of 5 strings)
 * @prop onFreePlanClick - Optional callback when free plan CTA is clicked
 * @prop onPremiumPlanClick - Optional callback when premium plan CTA is clicked
 */

/**
 * PricingSection component
 */
export default function PricingSection({
  sectionTitle,
  freePlanName,
  freePlanPrice,
  premiumPlanName,
  premiumPlanPrice,
  premiumPlanCTA,
  freePlanCTA,
  freePlanFeatures,
  premiumPlanFeatures,
  onFreePlanClick,
  onPremiumPlanClick,
  comingSoonText,
  popularBadgeLabel,
  perSiteText,
}: PricingSectionProps) {
  const premiumComingSoon = premiumPlanPrice.toLowerCase().includes("coming");

  const freeFeaturesList = freePlanFeatures ?? [];
  const premiumFeaturesList = premiumPlanFeatures ?? [];
  const freeCTA = freePlanCTA ?? "Get Started Free";

  return (
    <section aria-labelledby="pricing-heading" className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="pricing-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-12 p-4"
        >
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition transform duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold">{freePlanName}</h3>
            </div>

            <div className="mt-6 flex-1">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-900">
                {freePlanPrice}
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {freeFeaturesList.map((f, index) => (
                  <li
                    key={`free-feature-${index}-${f}`}
                    className="flex items-start"
                  >
                    <CheckIcon />
                    <span className="ml-2">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <MarketingButton
                variant="ghost"
                size="sm"
                fullWidth
                onClick={onFreePlanClick}
                aria-label={`${freePlanName} - ${freeCTA}`}
              >
                {freeCTA}
              </MarketingButton>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col h-full bg-white rounded-lg shadow-lg border-2 border-[#6ABDA6] p-6 transform transition duration-150 hover:scale-[1.01]">
            <div
              className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: "var(--marketing-color-primary)" }}
            >
              {popularBadgeLabel}
            </div>{" "}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {premiumPlanName}
                </h3>
              </div>
              {premiumComingSoon && (
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-[#F4A261] text-white rounded-md">
                  Coming Soon
                </span>
              )}
            </div>
            <div className="mt-6 flex-1">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-900">
                {premiumPlanPrice}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {premiumComingSoon ? comingSoonText : perSiteText}
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {premiumFeaturesList.map((f, index) => (
                  <li
                    key={`premium-feature-${index}-${f}`}
                    className="flex items-start"
                  >
                    <CheckIcon />
                    <span className="ml-2">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <MarketingButton
                variant="primary"
                size="sm"
                fullWidth
                disabled={premiumComingSoon}
                onClick={() => {
                  if (!premiumComingSoon) onPremiumPlanClick?.();
                }}
                aria-label={`${premiumPlanName} - ${premiumComingSoon ? "Notify me" : premiumPlanCTA}`}
              >
                {premiumComingSoon ? "Notify Me" : premiumPlanCTA}
              </MarketingButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
