"use client";

import { getSiteUrl } from "@/4-shared/helpers/domains/getSiteUrl";
import { getDomainSuffix } from "@/4-shared/helpers/domains/getSuffix";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType, Site } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { copyToClipboard } from "@/4-shared/utils/copyToClipboard";
import { isValidSubdomain } from "@/4-shared/utils/validations";
import { useState } from "react";
import { SubdomainEditingForm } from "../ui/SubdomainEditingForm";
import { SubdomainSection } from "../ui/SubdomainSection";

interface Props {
  site: Site;
  refresh: () => void;
  translations: Record<string, string>;
  planType: PlanType;
  canEdit?: boolean;
}

export default function SubdomainManager({
  site,
  refresh,
  translations,
  planType,
  canEdit = true,
}: Props) {
  const [subdomain, setSubdomain] = useState<string>(site.subdomain ?? "");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | string>(
    "idle",
  );
  const [helpText, setHelpText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const domainSuffix = getDomainSuffix();
  const activeUrl = getSiteUrl(site.subdomain ?? "");

  const handleCopy = () => {
    copyToClipboard(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify.success(translations["builder.domain.copied"] || "Link copied!");
  };

  async function handleSave() {
    if (!isValidSubdomain(subdomain)) {
      setStatus("error_invalid");
      setHelpText(translations["builder.domain.error_invalid"]);
      return;
    }

    setStatus("saving");
    try {
      const check = await fetch(
        `/api/sites/validate-subdomain?subdomain=${subdomain}`,
      );
      const { valid, reason } = await check.json();

      if (!valid) {
        setStatus(`error_${reason}`);
        setHelpText(
          translations[`builder.domain.error_${reason}`] ||
            translations["builder.domain.error_generic"],
        );
        return;
      }

      const res = await fetch(`/api/sites/${site.id}/subdomain`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setHelpText(translations["builder.domain.success_saved"]);
      await refresh();
      setEditing(false);
      notify.success(
        translations["builder.general.form.save_success"] || "Saved.",
      );
    } catch {
      setStatus("error");
      setHelpText(translations["builder.domain.error_generic"]);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <Heading as="h3" className="font-semibold text-gray-900 pb-2">
          {translations["builder.status.subdomain"]}
        </Heading>
        <p className="text-sm text-gray-500 mt-1">
          {translations["builder.domain.subdomain_desc"]}
        </p>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        {!editing ? (
          <SubdomainSection
            site={site}
            domainSuffix={domainSuffix}
            translations={translations}
            copied={copied}
            canEdit={canEdit}
            onCopy={handleCopy}
            onEdit={() => setEditing(true)}
          />
        ) : (
          <SubdomainEditingForm
            subdomain={subdomain}
            domainSuffix={domainSuffix}
            status={status}
            helpText={helpText}
            isSaving={status === "saving"}
            isOriginal={subdomain === (site.subdomain ?? "")}
            translations={translations}
            setSubdomain={(val) => {
              setSubdomain(val);
              setStatus("idle");
            }}
            onSave={handleSave}
            onCancel={() => {
              setEditing(false);
              setSubdomain(site.subdomain ?? "");
              setStatus("idle");
            }}
          />
        )}
      </div>
    </div>
  );
}
