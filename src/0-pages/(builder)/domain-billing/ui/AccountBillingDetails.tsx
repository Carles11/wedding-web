"use client";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { usePlan } from "@/app/providers";
import { useRouter } from "next/navigation";

export default function AccountBillingDetails({
  t,
}: {
  t: Record<string, string>;
}) {
  const { planType, features, subscription, usage, lastInvoice } = usePlan();
  const router = useRouter();
  // Language-prefixed routing: lang should be passed as a prop (from parent route context or page params).
  // If not available, fallback to "en".
  const lang = isValidLanguage(t?.lang) ? t.lang : "en";

  const canUpgrade = planType === "free";
  const canManage = planType === "premium" || planType?.startsWith("agency");

  const eventLimit = features?.limits?.events ?? -1;
  const eventUsage = usage?.events ?? 0;
  const usagePercent =
    eventLimit === -1 ? 0 : Math.min((eventUsage / eventLimit) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Current Plan */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t["billing.current_plan"] ?? "Current Plan"}
          </h2>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <p className="text-gray-600 text-sm max-w-md">
            {features?.description ?? t["billing.plan_desc_default"] ?? ""}
          </p>
          <span className="ml-4 shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            {t[`billing.plan_tier_${planType}`] ??
              planType ??
              t["billing.none"] ??
              "None"}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t["billing.features"] ?? "Features"}
          </h2>
        </div>
        <ul className="px-6 py-5 grid md:grid-cols-2 gap-3">
          {(features?.featuresList ?? []).map(
            (feature: string, index: number) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <svg
                  className="mt-0.5 shrink-0 text-blue-400 w-3.5 h-3.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="6" r="6" className="fill-blue-100" />
                  <path
                    d="M3.5 6L5.2 7.7L8.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Usage */}
      {usage && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {t["billing.usage"] ?? "Usage"}
            </h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>{t["billing.events"] ?? "Events"}</span>
              <span className="font-medium tabular-nums">
                {eventUsage}{" "}
                <span className="text-gray-400 font-normal">
                  /{" "}
                  {eventLimit === -1
                    ? (t["billing.unlimited"] ?? "Unlimited")
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
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {t["billing.subscription"] ?? "Subscription"}
            </h2>
          </div>
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-6 text-sm text-gray-700">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {t["billing.renewal_date"] ?? "Next renewal"}
              </span>
              <strong className="text-gray-900">
                {subscription.renewalDate ?? t["billing.date_unknown"]}
              </strong>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {t["billing.status"] ?? "Status"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-medium capitalize ${subscription.status === "active" ? "text-green-600" : "text-gray-700"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${subscription.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                />
                {subscription.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Last Invoice */}
      {lastInvoice && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {t["billing.last_invoice"] ?? "Last Invoice"}
            </h2>
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
              {t["billing.download_receipt"] ?? "Download"} ↓
            </a>
          </div>
        </div>
      )}

      {/* CTAs */}
      {/* Navigation uses language-prefixed URLs, e.g. /[lang]/pricing */}
      <div className="pt-2 flex gap-3">
        {canUpgrade && (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => router.push(`/${lang}/marketing/upgrade`)}
          >
            {t["billing.cta_upgrade"] ?? "Upgrade"}
          </button>
        )}
        {canManage && (
          <button
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => router.push(`/${lang}/pricing`)}
          >
            {t["billing.cta_pricing"] ?? "See all plans"}
          </button>
        )}
      </div>
    </div>
  );
}
