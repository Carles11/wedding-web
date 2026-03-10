"use client";
import { PlanType } from "@/4-shared/types";
import { useRouter } from "next/navigation";

interface Props {
  planType: PlanType;
  translations: Record<string, string>;
  siteId: string;

  // Add more props if you have: renewalDate, billingMethod, etc
}

export default function MembershipSection({
  planType,
  siteId,
  translations,
}: Props) {
  const router = useRouter();

  const planLabel = {
    free: translations["builder.billing.current_plan_free"],
    pro: translations["builder.billing.current_plan_pro"],
    agency_monthly: translations["builder.billing.current_plan_agency_monthly"],
    agency_yearly: translations["builder.billing.current_plan_agency_yearly"],
  }[planType];

  return (
    <section className="mt-12">
      <h4 className="font-semibold mb-2">
        {translations["builder.billing.membership_title"]}
      </h4>
      <div className="border rounded bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="font-medium text-gray-700">
            {translations["builder.billing.current_plan"]}: {planLabel}
          </div>
          <div
            className="mt-1 text-xs text-gray-500"
            dangerouslySetInnerHTML={{
              __html:
                planType === "free"
                  ? translations["builder.billing.features_free"]
                  : translations["builder.billing.features_paid"],
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {/* Only show upgrade if not already on top tier */}
          {planType === "free" && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => router.push("/upgrade")}
            >
              {translations["builder.billing.upgrade_btn"]}
            </button>
          )}
          {["monthly", "yearly"].includes(planType) && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              onClick={() => router.push(`/builder/${siteId}/account/billing`)}
            >
              {translations["builder.billing.manage_btn"]}
            </button>
          )}
        </div>
      </div>
      <div
        className="mt-2 text-xs text-blue-700 underline cursor-pointer"
        onClick={() => router.push("/pricing")}
      >
        {translations["builder.billing.learn_more"]}
      </div>
    </section>
  );
}
