"use client";

import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import { getLocalizedPlanFeatureTitles } from "@/4-shared/helpers/billing/entitlements";
import { t } from "@/4-shared/helpers/t";
import type { PlanType } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";

function formatLimit(val: number, t: Record<string, string>, prop: string) {
  if (val === -1) return t["pricing.unlimited"] ?? "Unlimited";
  if (val === 0 && prop === "customDomains") return t["pricing.none"] ?? "None";
  return val;
}

export default function PricingTable({
  translations,
  type,
  onSelect,
  lang = "en",
  isLoading = false,
}: {
  translations: Record<string, string>;
  type: "private" | "agency";
  onSelect?: (plan: PlanType) => void;
  lang?: string;
  isLoading?: boolean;
}) {
  const planKeys = Object.keys(PLAN_CATALOG) as PlanType[];

  const filteredPlans = planKeys.filter((p) =>
    // Agency plans start with "agency", private plans do not
    // (AGENCY PLANS MUST BE NAMED WITH "agency" PREFIX FOR THIS TO WORK: COMMING SOON)
    type === "agency" ? p.startsWith("agency") : !p.startsWith("agency"),
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2">
      {filteredPlans.map((plan) => {
        const def = PLAN_CATALOG[plan];
        const highlight = plan === "premium";

        // PRICE FORMATTING
        const formattedPrice =
          def.price === -1
            ? new Intl.NumberFormat(lang, {
                style: "currency",
                currency: def.currency,
              }).format(0.0)
            : new Intl.NumberFormat(lang, {
                style: "currency",
                currency: def.currency,
              }).format(def.price);

        // TRANSLATIONS
        const planName = t(translations, `pricing.plan.${plan}.name`, def.name);

        const localizedFeatures = getLocalizedPlanFeatureTitles(
          plan,
          translations,
        );

        const billingKey = `pricing.billing.${String(def.billing).replace("-", "_")}`;
        const billingLabel = t(translations, billingKey, String(def.billing));

        return (
          <div
            key={plan}
            className={`
            relative flex flex-col rounded-2xl border bg-white
            p-8 shadow-sm transition
            ${isLoading ? "opacity-80 pointer-events-none" : "hover:shadow-xl hover:-translate-y-1"}
            ${highlight ? "border-blue-500 shadow-lg" : "border-gray-200"}
            `}
          >
            {highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                {translations["pricing.most_popular"] ?? "Most loved"}
              </span>
            )}

            {/* PLAN TITLE */}
            <div className="mb-6 text-center">
              <Heading as="h3" className="text-xl font-semibold">
                {planName}
              </Heading>
            </div>

            {/* PRICE */}
            <div className="text-center mb-6">
              {formattedPrice ? (
                <>
                  <p className="text-4xl font-bold">{formattedPrice}</p>
                  <p className="text-sm text-gray-500">
                    {def.billing === "one-time"
                      ? billingLabel
                      : `${billingLabel}`}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-semibold">
                  {t(translations, "pricing.free", "Free")}
                </p>
              )}
            </div>

            {/* FEATURES (comming from PLAN_CATALOG. src\4-shared\config\plans\planCatalog.ts */}
            <ul className="mb-6 space-y-3 text-sm">
              {localizedFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                    ✓
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* LIMITS  (comming from PLAN_CATALOG.limits src\4-shared\config\plans\planCatalog.ts */}
            {def.limits && (
              <div className="mt-auto border-t pt-4 text-sm">
                <div className="space-y-2">
                  {Object.entries(def.limits).map(([prop, val]) => (
                    <div key={prop} className="flex justify-between">
                      <span className="text-gray-500 capitalize">
                        {t(
                          translations,
                          `pricing.limit.${prop}`,
                          prop.replace(/([A-Z])/g, " $1").trim(),
                        )}
                      </span>
                      <span className="font-medium">
                        {formatLimit(val as number, translations, prop)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA BUTTON */}
            {onSelect && (
              <button
                disabled={isLoading}
                className={`
                  mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }
                `}
                onClick={() => onSelect(plan)}
              >
                {isLoading
                  ? (translations["loading"] ?? "Almost there…")
                  : (translations["pricing.cta"] ?? "Get started")}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
