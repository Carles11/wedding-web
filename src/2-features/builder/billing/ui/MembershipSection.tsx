"use client";
import { getLocalizedPlanFeatureTitles } from "@/4-shared/helpers/billing/entitlements";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import type { PlanType } from "@/4-shared/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
  const langRaw = params.get("lang");
  const lang = isValidLanguage(langRaw ?? undefined) ? (langRaw ?? "en") : "en";
  const [isHovered, setIsHovered] = useState(false);

  const planLabel = {
    free: translations["builder.billing.current_plan_free"],
    premium: translations["builder.billing.current_plan_premium"],
  }[planType];

  const localizedFeatures = getLocalizedPlanFeatureTitles(
    planType,
    translations,
  );

  const canUpgrade = planType === "free";
  const canManage = planType === "premium";

  return (
    <section className="mt-12">
      <h4 className="font-semibold text-gray-900 mb-4">
        {translations["builder.billing.membership_title"]}
      </h4>

      <div
        className="relative border border-gray-200 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)} // ✅ always fires, for both plan types
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative background accent */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-50 opacity-60 blur-2xl" />

        {/* Hover overlay */}
        {(canUpgrade || canManage) && (
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-600/4 backdrop-blur-[1px] transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
            // ✅ no pointer-events-none here — clicks must pass through
          >
            <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg tracking-wide">
              <button
                type="button"
                className="cursor-pointer"
                onClick={() =>
                  canUpgrade
                    ? router.push(`/${lang}/pricing`)
                    : router.push(`/${lang}/builder/${siteId}/domain-billing`)
                }
              >
                ✦{" "}
                {canUpgrade
                  ? translations["builder.general.form.upgrade"] ||
                    "Upgrade to Premium"
                  : translations["builder.billing.manage_btn"] ||
                    "Manage Subscription"}
              </button>
            </span>
          </div>
        )}

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-3 relative pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {translations["builder.billing.current_plan"]}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm tracking-wide uppercase">
              {planLabel}
            </span>
          </div>

          <ul className="space-y-1.5 text-sm text-gray-500 leading-relaxed">
            {localizedFeatures.map((feature, index) => (
              <li
                key={`${planType}-feature-${index}`}
                className="flex items-start gap-2"
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
            ))}
          </ul>
        </div>
      </div>

      <div
        className="mt-3 text-sm text-blue-700 underline cursor-pointer hover:text-blue-800 transition"
        onClick={() => router.push(`/${lang}/pricing`)}
      >
        {translations["builder.billing.learn_more"]}
      </div>
    </section>
  );
}
