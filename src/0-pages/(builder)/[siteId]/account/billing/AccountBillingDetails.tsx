"use client";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { usePlan } from "@/app/providers";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccountBillingDetails({
  t,
}: {
  t: Record<string, string>;
}) {
  const { planType, features, subscription, usage, lastInvoice } = usePlan();
  const router = useRouter();

  const params = useSearchParams();

  const langRaw = params.get("lang"); // langRaw: string | null
  const lang = isValidLanguage(langRaw ?? undefined) ? (langRaw ?? "en") : "en";

  const canUpgrade = planType === "free";
  const canManage = planType === "premium" || planType?.startsWith("agency");

  const eventLimit = features?.limits?.events ?? -1;
  const eventUsage = usage?.events ?? 0;

  const usagePercent =
    eventLimit === -1 ? 0 : Math.min((eventUsage / eventLimit) * 100, 100);

  return (
    <main className="relative overflow-hidden">
      {/* same background glow as pricing */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* HERO */}
        <div className="text-center mb-20">
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {t["billing.summary"] ??
              "Manage your plan, billing information and subscription details."}
          </p>
        </div>

        {/* CURRENT PLAN */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">
              {t["billing.current_plan"] ?? "Current Plan"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
              {t[`billing.plan_tier_${planType}`] ??
                planType ??
                t["billing.none"] ??
                "None"}
            </span>

            <p className="text-gray-600 max-w-lg mx-auto">
              {features?.description ?? t["billing.plan_desc_default"] ?? ""}
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">
              {t["billing.features"] ?? "Features"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              {(features?.featuresList ?? []).map((f: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                    *
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* USAGE */}
        {usage && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-3">
                {t["billing.usage"] ?? "Usage"}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>{t["billing.events"] ?? "Events"}</span>
                <span>
                  {eventUsage} /{" "}
                  {eventLimit === -1
                    ? (t["billing.unlimited"] ?? "Unlimited")
                    : eventLimit}
                </span>
              </div>

              {eventLimit !== -1 && (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* SUBSCRIPTION */}
        {subscription && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-3">
                {t["billing.subscription"] ?? "Subscription"}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center space-y-2">
              <div>
                {t["billing.renewal_date"] ?? "Next renewal"}:{" "}
                <strong>
                  {subscription.renewalDate ?? t["billing.date_unknown"]}
                </strong>
              </div>

              <div>
                {t["billing.status"] ?? "Status"}:{" "}
                <strong className="capitalize">{subscription.status}</strong>
              </div>
            </div>
          </section>
        )}

        {/* LAST INVOICE */}
        {lastInvoice && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-3">
                {t["billing.last_invoice"] ?? "Last Invoice"}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex items-center justify-between max-w-xl mx-auto">
              <div>
                {lastInvoice.date} -{" "}
                <strong>
                  {lastInvoice.amount} {lastInvoice.currency}
                </strong>
              </div>

              <a
                className="text-blue-600 hover:text-blue-800 font-medium"
                href={lastInvoice.downloadUrl}
                target="_blank"
                rel="noopener"
              >
                {t["billing.download_receipt"] ?? "Download"}
              </a>
            </div>
          </section>
        )}

        {/* ACTIONS */}
        <div className="flex justify-center gap-4">
          {canUpgrade && (
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => router.push(`/marketing/upgrade?lang=${lang}`)}
            >
              {t["billing.cta_upgrade"] ?? "Upgrade"}
            </button>
          )}

          {canManage && (
            <button
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={() => router.push(`/marketing/pricing?lang=${lang}`)}
            >
              {t["billing.cta_pricing"] ?? "See all plans"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
