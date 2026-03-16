"use client";

import MembershipSection from "@/2-features/builder/billing/ui/MembershipSection";
import CustomDomainSection from "@/2-features/builder/custom-domain/components/CustomDomainSection";
import SubdomainManager from "@/2-features/builder/custom-domain/components/SubdomainManager";
import type { Site, TranslationDictionary } from "@/4-shared/types";
import { PlanType } from "@/4-shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DomainAndBillingBuilderStepProps {
  site: Site;
  refresh: () => void;
  lang: string;
  translations: TranslationDictionary;
  planType: PlanType;
}

export default function DomainAndBillingBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
}: DomainAndBillingBuilderStepProps) {
  const router = useRouter();

  const handleUpgradeClick = () =>
    router.push(`/marketing/pricing?lang=${lang || "en"}`);

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
      <div className="mb-4 text-md text-gray-600">
        {translations["builder.step.domain_billing_subtitle"]}
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
        onUpgradeClick={handleUpgradeClick}
        refetchDomains={refetchDomains}
        loading={domainLoading}
      />
      <MembershipSection
        planType={planType}
        translations={translations}
        siteId={site.id}
      />
    </div>
  );
}
