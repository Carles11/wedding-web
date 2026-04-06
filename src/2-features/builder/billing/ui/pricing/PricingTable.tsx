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
    type === "agency" ? p.startsWith("agency") : !p.startsWith("agency"),
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2 marketing-theme">
      {filteredPlans.map((plan) => {
        const def = PLAN_CATALOG[plan];
        const highlight = plan === "premium";

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

        const planName = t(translations, `pricing.plan.${plan}.name`, def.name);

        const localizedFeatures = getLocalizedPlanFeatureTitles(
          plan,
          translations,
        );

        const billingKey = `pricing.billing.${String(def.billing).replace(
          "-",
          "_",
        )}`;
        const billingLabel = t(translations, billingKey, String(def.billing));

        return (
          <div
            key={plan}
            style={{
              borderColor: highlight
                ? "var(--marketing-color-primary)"
                : undefined,
            }}
            className={`
            relative flex flex-col rounded-2xl border bg-white
            p-8 shadow-sm transition
            ${isLoading ? "opacity-80 pointer-events-none" : "hover:shadow-xl hover:-translate-y-1"}
            ${highlight ? "shadow-lg ring-1 ring-[var(--marketing-color-primary)]" : "border-gray-200"}
            `}
          >
            {highlight && (
              <span
                style={{ backgroundColor: "var(--marketing-color-primary)" }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs text-white font-bold"
              >
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

            {/* FEATURES */}
            <ul className="mb-6 space-y-3 text-sm">
              {localizedFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    style={{
                      backgroundColor: "var(--marketing-color-primary)",
                      opacity: 0.15,
                    }}
                    className="mt-1 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  ></span>
                  <span
                    style={{ color: "var(--marketing-color-primary)" }}
                    className="mt-1 -ml-8 flex h-5 w-5 items-center justify-center text-xs font-bold"
                  >
                    ✓
                  </span>
                  <span className="ml-0">{feat}</span>
                </li>
              ))}
            </ul>

            {/* LIMITS */}
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
                      <span className="font-medium text-[var(--foreground)]">
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
                style={{
                  backgroundColor: isLoading
                    ? "#9ca3af"
                    : "var(--marketing-color-primary)",
                }}
                className={`
                  mt-8 w-full rounded-full py-3 text-sm font-semibold text-white transition
                  hover:brightness-110 active:scale-95
                  ${isLoading ? "cursor-not-allowed" : "cursor-pointer shadow-md"}
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
