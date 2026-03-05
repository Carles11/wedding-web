"use client";

import { useRouter } from "next/navigation";
import SubdomainManager from "./SubdomainManager";
import CustomDomainSection from "./CustomDomainSection";
import type { Site, TranslationDictionary } from "@/4-shared/types";
import MembershipSection from "./MembershipSection";
import { useState } from "react";

interface DomainAndBillingBuilderStepProps {
  site: Site;
  refresh: () => void;
  lang: string;
  translations: TranslationDictionary;
  planType: "free" | "monthly" | "yearly";
}

export default function DomainAndBillingBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
}: DomainAndBillingBuilderStepProps) {
  const router = useRouter();

  const handleUpgradeClick = () => router.push("/upgrade");

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
    // await refresh();
    setDomainLoading(false);
  };

  return (
    <div>
      <div className="mb-4 text-xl text-gray-600">
        <h3>{translations["builder.step.domain_billing_subtitle"]}</h3>
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
      <MembershipSection planType={planType} translations={translations} />
    </div>
  );
}
