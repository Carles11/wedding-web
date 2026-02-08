"use client";

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
export interface PricingSectionProps {
  sectionTitle: string;
  freePlanName: string;
  freePlanPrice: string;
  /** CTA for free plan button */
  freePlanCTA?: string;
  /** Feature texts for free plan */
  freePlanFeatures?: string[];
  premiumPlanName: string;
  premiumPlanPrice: string;
  premiumPlanCTA: string;
  /** Feature texts for premium plan */
  premiumPlanFeatures?: string[];
  onFreePlanClick?: () => void;
  onPremiumPlanClick?: () => void;
}

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
}: PricingSectionProps) {
  const premiumComingSoon = premiumPlanPrice.toLowerCase().includes("coming");

  const defaultFreeFeatures = [
    "Free subdomain (yourname.weddweb.com)",
    "1 language",
    "2 accommodation tips",
    "2 activity suggestions",
  ];

  const defaultPremiumFeatures = [
    "Custom domain",
    "Unlimited languages",
    "Unlimited content",
    "Gift registry (coming soon)",
    "Priority support (future)",
  ];

  const freeFeaturesList = freePlanFeatures ?? defaultFreeFeatures;
  const premiumFeaturesList = premiumPlanFeatures ?? defaultPremiumFeatures;
  const freeCTA = freePlanCTA ?? "Get Started Free";

  return (
    <section aria-labelledby="pricing-heading" className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="pricing-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition transform duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold">{freePlanName}</h3>
              <div className="text-sm text-gray-500">{freePlanPrice}</div>
            </div>

            <div className="mt-6 flex-1">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-900">
                {freePlanPrice.split(" ")[0]}
              </div>
              <div className="text-sm text-gray-600 mt-2">forever</div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {freeFeaturesList.map((f) => (
                  <li key={f} className="flex items-start">
                    <span className="text-[#6ABDA6] mr-3 mt-0.5">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onFreePlanClick}
                aria-label={`${freePlanName} - ${freeCTA}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6ABDA6]"
              >
                {freeCTA}
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border-2 border-[#6ABDA6] p-6 transform transition duration-150 hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {premiumPlanName}
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  {premiumPlanPrice}
                </div>
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
                {premiumComingSoon ? "Stay tuned" : "Per site"}
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {premiumFeaturesList.map((f) => (
                  <li key={f} className="flex items-start">
                    <span className="text-[#6ABDA6] mr-3 mt-0.5">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  if (!premiumComingSoon) onPremiumPlanClick?.();
                }}
                aria-label={`${premiumPlanName} - ${premiumComingSoon ? "Notify me" : premiumPlanCTA}`}
                disabled={premiumComingSoon}
                className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6ABDA6] ${
                  premiumComingSoon
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-[#6ABDA6] text-white hover:bg-teal-600"
                }`}
              >
                {premiumComingSoon ? "Notify Me" : premiumPlanCTA}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
