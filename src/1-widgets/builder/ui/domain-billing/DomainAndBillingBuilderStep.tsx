"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubdomainManager from "./SubdomainManager";
import CustomDomainSection from "./CustomDomainSection";
import type { Site, TranslationDictionary } from "@/4-shared/types";
import MembershipSection from "./MembershipSection";

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

  // Only non-weddweb domains are considered "custom"
  const initialCustomDomain =
    site.domains?.find(
      (d) => !d.endsWith(".weddweb.com") && !d.endsWith(".localhost:3000"),
    ) || "";

  const [customDomainValue, setCustomDomainValue] =
    useState<string>(initialCustomDomain);
  const [customDomainSaveLoading, setCustomDomainSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error" | "pending" | "verified"
  >("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [dnsInstructions, setDnsInstructions] = useState<string | null>(null);

  const handleUpgradeClick = () => router.push("/upgrade");

  // Handle domain save: contact your backend, update UI
  const handleCustomDomainSave = async (domain: string) => {
    setCustomDomainSaveLoading(true);
    setSaveStatus("saving");
    setSaveMessage("");
    setDnsInstructions(null);

    try {
      const res = await fetch(`/api/sites/${site.id}/custom-domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || translations["builder.domain.error_generic"],
        );
      }
      const data = await res.json();
      setSaveStatus("success");
      setSaveMessage(translations["builder.domain.success_saved"]);
      if (data.dns_instructions) setDnsInstructions(data.dns_instructions);
      setCustomDomainValue(domain);
      refresh();
    } catch (err: unknown) {
      setSaveStatus("error");
      setSaveMessage(
        (err instanceof Error ? err.message : String(err)) ||
          translations["builder.domain.error_generic"],
      );
    } finally {
      setCustomDomainSaveLoading(false);
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
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
        planType={planType}
        translations={translations}
        customDomain={customDomainValue}
        onUpgradeClick={handleUpgradeClick}
        onSave={planType !== "free" ? handleCustomDomainSave : undefined}
        loading={customDomainSaveLoading}
        status={saveStatus}
        statusMessage={saveMessage}
        dnsInstructions={dnsInstructions}
      />
      <MembershipSection planType={planType} translations={translations} />
    </div>
  );
}
