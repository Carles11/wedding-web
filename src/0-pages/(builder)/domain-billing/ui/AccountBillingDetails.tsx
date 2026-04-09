"use client";

import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { usePlan } from "@/app/providers";
import { useRouter } from "next/navigation";

export default function AccountBillingDetails({
  translations,
  lang,
}: {
  translations: Record<string, string>;
  lang: string;
}) {
  const {
    planType,
    features: planEntitlements,
    subscription,
    usage,
    lastInvoice,
  } = usePlan();
  const router = useRouter();

  // 1. Get the static marketing info from the catalog
  // We use the 'planType' from usePlan as the key
  const catalogItem = PLAN_CATALOG[planType as keyof typeof PLAN_CATALOG];

  const canUpgrade = planType === "free";
  const canManage = planType === "premium" || planType?.startsWith("agency");

  // 2. Resolve the plan description
  const descKey = catalogItem?.descriptionTranslationKeys?.[0];
  const displayDescription =
    descKey && translations[descKey]
      ? translations[descKey]
      : catalogItem?.description || translations["billing.plan_desc_default"];

  // 3. Logic for Usage Progress
  const eventLimit = planEntitlements?.limits?.events ?? -1;
  const eventUsage = usage?.events ?? 0;
  const usagePercent =
    eventLimit === -1 ? 0 : Math.min((eventUsage / eventLimit) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <Heading
            as="h2"
            className="text-sm font-semibold text-gray-500 uppercase tracking-wider"
          >
            {translations["billing.current_plan"] ?? "Current Plan"}
          </Heading>
          <div
            className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
              planType === "premium"
                ? "bg-(--builder-color-primary) text-white border-(--builder-color-primary-hover)"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {" "}
            {translations[`billing.plan_tier_${planType}`] ??
              catalogItem?.name ??
              planType}
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm max-w-md leading-relaxed">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <Heading
            as="h2"
            className="text-sm font-semibold text-gray-500 uppercase tracking-wider"
          >
            {translations["billing.features"] ?? "Included Features"}
          </Heading>
        </div>
        <ul className="px-6 py-5 grid md:grid-cols-2 gap-x-8 gap-y-4">
          {catalogItem?.features.map((feature, index) => {
            // Priority: Translated Title > Title String
            const titleKey = feature.titleTranslationKeys?.[0];
            const displayTitle =
              titleKey && translations[titleKey]
                ? translations[titleKey]
                : feature.title;

            // Priority: Translated Marketing Desc > Marketing Desc String
            const marketingKey = feature.marketingDescriptionTranslationKey;
            const displayMarketing =
              marketingKey && translations[marketingKey]
                ? translations[marketingKey]
                : feature.marketingDescription;

            return (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {displayTitle}
                  </p>
                  {displayMarketing && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {displayMarketing}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Usage */}
      {usage && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Heading
              as="h2"
              className="text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              {translations["billing.usage"] ?? "Usage"}
            </Heading>
          </div>
          <div className="px-6 py-5">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>{translations["billing.events"] ?? "Events"}</span>
              <span className="font-medium tabular-nums">
                {eventUsage}{" "}
                <span className="text-gray-400 font-normal">
                  /{" "}
                  {eventLimit === -1
                    ? (translations["billing.unlimited"] ?? "Unlimited")
                    : eventLimit}
                </span>
              </span>
            </div>
            {eventLimit !== -1 && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${usagePercent > 85 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription */}
      {subscription && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Heading
              as="h2"
              className="text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              {translations["billing.subscription"] ?? "Subscription"}
            </Heading>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-6 text-sm text-gray-700">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {translations["billing.renewal_date"] ?? "Next renewal"}
              </span>
              <strong className="text-gray-900">
                {subscription.renewalDate === null
                  ? (translations["billing.renewal_never"] ?? "Never")
                  : (subscription.renewalDate ??
                    translations["billing.date_unknown"])}
              </strong>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {translations["billing.status"] ?? "Status"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-medium capitalize ${subscription.status === "active" ? "text-green-600" : "text-gray-700"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${subscription.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                />
                {translations[`billing.status.${subscription.status}`] ??
                  subscription.status}{" "}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Last Invoice */}
      {lastInvoice && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Heading
              as="h2"
              className="text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              {translations["billing.last_invoice"] ?? "Last Invoice"}
            </Heading>
          </div>
          <div className="px-6 py-5 flex items-center justify-between text-sm text-gray-700">
            <span>
              {lastInvoice.date} —{" "}
              <strong className="text-gray-900">
                {lastInvoice.amount} {lastInvoice.currency}
              </strong>
            </span>
            <a
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              href={lastInvoice.downloadUrl}
              target="_blank"
              rel="noopener"
            >
              {translations["billing.download_receipt"] ?? "Download"} ↓
            </a>
          </div>
        </div>
      )}

      {/* CTAs */}
      {/* Navigation uses language-prefixed URLs, e.g. /[lang]/pricing */}
      <div className="pt-2 flex gap-3">
        {canUpgrade && (
          <BuilderButton
            variant="primary"
            onClick={() => router.push(`/${lang || "en"}/marketing/upgrade`)}
          >
            {translations["billing.cta_upgrade"] ?? "Upgrade"}
          </BuilderButton>
        )}
        {canManage && (
          <BuilderButton
            variant="primary"
            onClick={() => router.push(`/${lang || "en"}/pricing`)}
          >
            {translations["billing.cta_pricing"] ?? "See all plans"}
          </BuilderButton>
        )}
        <BuilderButton
          variant="secondary"
          onClick={() => router.push(`/${lang || "en"}/builder?step=7`)}
        >
          {translations["builder.actions.back"] ?? "Back to Builder"}
        </BuilderButton>
      </div>
    </div>
  );
}
