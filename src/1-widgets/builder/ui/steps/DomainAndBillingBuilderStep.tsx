"use client";

import MembershipSection from "@/2-features/builder/billing/ui/MembershipSection";
import CustomDomainSection from "@/2-features/builder/custom-domain/components/CustomDomainSection";
import SubdomainManager from "@/2-features/builder/custom-domain/components/SubdomainManager";
import type { DomainAndBillingBuilderStepProps } from "@/4-shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DomainAndBillingBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
}: DomainAndBillingBuilderStepProps) {
  const router = useRouter();

  // Use language-prefixed routing, not query param
  const handleUpgradeClick = () => router.push(`/${lang || "en"}/pricing`);

  // 1. All "real" custom domains (not platform test/production domains)
  const verifiedDomains =
    site.domains?.filter(
      (d) => !d.endsWith(".weddweb.com") && !d.endsWith(".localhost:3000"),
    ) || [];

  // 2. Pending domains list
  const pendingDomains = site.pending_custom_domains || [];

  // 3. Status map for all domains
  const domainStatuses = site.domain_statuses || {};

  // 4. Loader refresh after add/remove
  const [domainLoading, setDomainLoading] = useState(false);

  const refetchDomains = async () => {
    setDomainLoading(true);
    try {
      await refresh();
    } finally {
      setDomainLoading(false);
    }
  };

  return (
    <div>
      {/* Conditional Subtitle based on Plan */}
      <div className="mb-6 text-md text-gray-600">
        {planType === "premium" ? (
          // Premium Message: Focused on management and success
          <span>
            {translations["builder.step.domain_billing_subtitle_premium"] ||
              "Manage your professional web address and billing details below."}
          </span>
        ) : (
          // Free Message: Focused on the upgrade path
          <span>
            {translations["builder.step.domain_billing_subtitle"] ||
              "Set up the web address of your event site. You can upgrade to unlock custom domains and access billing options."}
          </span>
        )}
      </div>
      <SubdomainManager
        site={site}
        refresh={refresh}
        translations={translations}
        planType={planType}
      />
      <CustomDomainSection
        siteId={site.id}
        planType={planType}
        translations={translations}
        verifiedDomains={verifiedDomains}
        pendingDomains={pendingDomains}
        domainStatuses={domainStatuses}
        domainProviderApiUrl={site.domain_provider_api_url}
        onUpgradeClick={handleUpgradeClick}
        refetchDomains={refetchDomains}
        loading={domainLoading}
      />
      <MembershipSection
        planType={planType}
        translations={translations}
        siteId={site.id}
        lang={lang}
      />
    </div>
  );
}
