"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { PlanType } from "@/4-shared/types";

interface Props {
  planType: PlanType;
  translations: Record<string, string>;
  siteId: string;
}

export default function MembershipSection({
  planType,
  siteId,
  translations,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const langRaw = params.get("lang"); // langRaw: string | null
  const lang = isValidLanguage(langRaw ?? undefined) ? (langRaw ?? "en") : "en";

  const planLabel = {
    free: translations["builder.billing.current_plan_free"],
    premium: translations["builder.billing.current_plan_premium"],
    agency_monthly: translations["builder.billing.current_plan_agency_monthly"],
    agency_yearly: translations["builder.billing.current_plan_agency_yearly"],
  }[planType];

  const featuresHtml =
    planType === "free"
      ? translations["builder.billing.features_free"]
      : planType === "agency_monthly" || planType === "agency_yearly"
        ? translations["builder.billing.features_paid_agency"]
        : translations["builder.billing.features_paid"];

  const isAgency =
    planType === "agency_monthly" || planType === "agency_yearly";
  const canUpgrade = planType === "free";
  const canManage = planType === "premium" || isAgency;

  return (
    <section className="mt-12">
      <h4 className="font-semibold text-gray-900 mb-4">
        {translations["builder.billing.membership_title"]}
      </h4>

      <div className="border rounded-lg bg-gray-50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition hover:shadow-sm">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {translations["builder.billing.current_plan"]}
            </span>

            <span className="px-2.5 py-1 text-xs font-medium rounded bg-white border text-gray-700">
              {planLabel}
            </span>
          </div>

          <div
            className="text-sm text-gray-500 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: featuresHtml,
            }}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {canUpgrade && (
            <button
              type="button"
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              onClick={() => router.push(`/marketing/pricing?lang=${lang}`)}
            >
              {translations["builder.billing.upgrade_btn"]}
            </button>
          )}

          {canManage && (
            <button
              type="button"
              className="px-5 py-2.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition"
              onClick={() =>
                router.push(`/builder/${siteId}/account/billing?lang=${lang}`)
              }
            >
              {translations["builder.billing.manage_btn"]}
            </button>
          )}
        </div>
      </div>

      <div
        className="mt-3 text-sm text-blue-700 underline cursor-pointer hover:text-blue-800 transition"
        onClick={() => router.push(`/marketing/pricing?lang=${lang}`)}
      >
        {translations["builder.billing.learn_more"]}
      </div>
    </section>
  );
}
