"use client";
import { getLocalizedPlanFeatureTitles } from "@/4-shared/helpers/billing/entitlements";
import type { PlanType } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import { ArrowRight, Check, Sparkles } from "lucide-react"; // Recommended: lucide-react for icons
import { useRouter } from "next/navigation";

interface Props {
  planType: PlanType;
  translations: Record<string, string>;
  siteId: string;
  lang: string;
}

export default function MembershipSection({
  planType,
  siteId,
  translations,
  lang,
}: Props) {
  const router = useRouter();

  const planLabel = {
    free: translations["builder.billing.current_plan_free"],
    premium: translations["builder.billing.current_plan_premium"],
  }[planType];

  const localizedFeatures = getLocalizedPlanFeatureTitles(
    planType,
    translations,
  );

  const canUpgrade = planType === "free";

  const handleAction = () => {
    if (canUpgrade) {
      router.push(`/${lang}/pricing`);
    } else {
      router.push(`/${lang}/builder/${siteId}/billing`);
    }
  };

  return (
    <section className="mt-12 max-w-3xl">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {translations["builder.billing.membership_title"]}
      </h4>

      <div className="group relative border border-gray-200 rounded-3xl bg-white p-1 shadow-sm transition-all hover:shadow-md">
        {/* Subtle Gradient Inner Border for Premium */}
        <div
          className={`rounded-[22px] p-6 flex flex-col md:flex-row md:items-center gap-6 ${
            planType === "premium"
              ? "bg-linear-to-br from-(blue-50/50) to-white"
              : "bg-white"
          }`}
        >
          {/* LEFT: Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                  planType === "premium"
                    ? "bg-(--builder-color-primary) text-white border-(--builder-color-primary-hover)"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {planLabel}
              </div>
              <span className="text-xs text-gray-400 font-medium italic">
                {translations["builder.billing.current_plan"]}
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {localizedFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check className="w-4 h-4 text-(--builder-color-primary) shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Action (Responsive divider on mobile) */}
          <div className="pt-6 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-100 flex items-center justify-center">
            <BuilderButton
              type="button"
              variant={canUpgrade ? "primary" : "secondary"}
              className="w-full md:w-auto min-w-[160px] flex items-center justify-center gap-2 shadow-sm"
              onClick={handleAction}
            >
              {canUpgrade ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  {translations["builder.general.form.upgrade"] || "Upgrade"}
                </>
              ) : (
                <>
                  {translations["builder.billing.manage_btn"] || "Manage"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </BuilderButton>
          </div>
        </div>
      </div>

      <button
        className="mt-4 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
        onClick={() => router.push(`/${lang}/pricing`)}
      >
        {translations["builder.billing.learn_more"]}
        <ArrowRight className="w-3 h-3" />
      </button>
    </section>
  );
}
