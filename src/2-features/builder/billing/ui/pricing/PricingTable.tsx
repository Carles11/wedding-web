import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import { getLocalizedPlanFeatureTitles } from "@/4-shared/helpers/billing/entitlements";
import type { PlanType } from "@/4-shared/types";

function formatLimit(val: number, t: Record<string, string>, prop: string) {
  if (val === -1) return t["pricing.unlimited"] ?? "Unlimited";
  if (val === 0 && prop === "customDomains") return t["pricing.none"] ?? "None";
  return val;
}

function tr(
  translations: Record<string, string>,
  key: string,
  fallback: string,
) {
  return translations[key] ?? fallback;
}

export default function PricingTable({
  translations,
  type,
  onSelect,
  lang = "en",
}: {
  translations: Record<string, string>;
  type: "private" | "agency";
  onSelect?: (plan: PlanType) => void;
  lang?: string;
}) {
  const planKeys = Object.keys(PLAN_CATALOG) as PlanType[];

  const filteredPlans = planKeys.filter((p) =>
    type === "agency" ? p.startsWith("agency") : !p.startsWith("agency"),
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2">
      {filteredPlans.map((plan) => {
        const def = PLAN_CATALOG[plan];
        const highlight = plan === "premium";

        const formattedPrice =
          def.price === -1
            ? null
            : new Intl.NumberFormat(lang, {
                style: "currency",
                currency: def.currency,
              }).format(def.price);

        const planName = tr(
          translations,
          `pricing.plan.${plan}.name`,
          def.name,
        );

        const localizedFeatures = getLocalizedPlanFeatureTitles(
          plan,
          translations,
        );

        const billingKey = `pricing.billing.${String(def.billing).replace("-", "_")}`;
        const billingLabel = tr(translations, billingKey, String(def.billing));

        return (
          <div
            key={plan}
            className={`
            relative flex flex-col rounded-2xl border bg-white
            p-8 shadow-sm transition
            hover:shadow-xl hover:-translate-y-1
            ${highlight ? "border-blue-500 shadow-lg" : "border-gray-200"}
            `}
          >
            {highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                {translations["pricing.most_popular"] ?? "Most popular"}
              </span>
            )}

            {/* PLAN TITLE */}
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold">{planName}</h3>
            </div>

            {/* PRICE */}
            <div className="text-center mb-6">
              {formattedPrice ? (
                <>
                  <p className="text-4xl font-bold">{formattedPrice}</p>

                  {def.billing !== "one-time" && (
                    <p className="text-sm text-gray-500">/{billingLabel}</p>
                  )}

                  {def.billing === "one-time" && (
                    <p className="text-sm text-gray-500">{billingLabel}</p>
                  )}
                </>
              ) : (
                <p className="text-2xl font-semibold">
                  {tr(translations, "pricing.free", "Free")}
                </p>
              )}
            </div>

            {/* FEATURES */}
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

            {/* LIMITS */}
            {def.limits && (
              <div className="mt-auto border-t pt-4 text-sm">
                <div className="space-y-2">
                  {Object.entries(def.limits).map(([prop, val]) => (
                    <div key={prop} className="flex justify-between">
                      <span className="text-gray-500 capitalize">
                        {tr(
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

            {/* CTA */}
            {onSelect && (
              <button
                className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                onClick={() => onSelect(plan)}
              >
                {translations["pricing.cta"] ?? "Select"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
