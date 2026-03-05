"use client";

import React, { useState } from "react";
import { addCustomDomainClient } from "@/2-features/custom-domain/api/addCustomDomain.client";
import { removeCustomDomainClient } from "@/2-features/custom-domain/api/removeCustomDomain.client";
import { verifyCustomDomainClient } from "@/2-features/custom-domain/api/verifyCustomDomain.client";

interface Props {
  planType: "free" | "monthly" | "yearly";
  translations: Record<string, string>;
  siteId: string;
  // These come from your page's loader/server and should be passed as props!
  verifiedDomains: string[];
  pendingDomains: string[];
  domainStatuses: Record<string, string>; // { domain: "pending" | "verified" | "error" }
  onUpgradeClick: () => void;
  refetchDomains: () => Promise<void>;
  loading?: boolean;
}

export const CustomDomainSection: React.FC<Props> = ({
  planType,
  translations,
  siteId,
  verifiedDomains,
  pendingDomains,
  domainStatuses,
  onUpgradeClick,
  refetchDomains,
  loading = false,
}) => {
  const [inputDomain, setInputDomain] = useState("");
  const [localStatus, setLocalStatus] = useState<
    "" | "saving" | "success" | "error"
  >("");
  const [localMsg, setLocalMsg] = useState<string | null>(null);
  const [domainInfo, setDomainInfo] = useState<
    Record<
      string,
      { status?: string; dnsInstructions?: string; error?: string }
    >
  >({});

  const isPaid = planType !== "free";

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalStatus("saving");
    setLocalMsg(null);
    try {
      await addCustomDomainClient(siteId, inputDomain);
      setLocalStatus("success");
      setLocalMsg(translations["builder.domain.custom_domain_success"]);
      setInputDomain("");
      await refetchDomains();
    } catch (err) {
      setLocalStatus("error");
      setLocalMsg(
        err instanceof Error
          ? err.message
          : translations["builder.domain.error_generic"],
      );
    }
  };

  const handleCheckStatus = async (domain: string) => {
    setLocalStatus("saving");
    setLocalMsg(null);
    try {
      const result = await verifyCustomDomainClient(siteId, domain);
      setDomainInfo((old) => ({
        ...old,
        [domain]: {
          status: result.status,
          dnsInstructions: result.dnsInstructions || null,
        },
      }));
      setLocalStatus("success");
      setLocalMsg(
        translations["builder.domain.custom_domain_checked"] ||
          "Status checked.",
      );
      await refetchDomains();
    } catch (err) {
      setLocalStatus("error");
      setLocalMsg(
        err instanceof Error
          ? err.message
          : translations["builder.domain.error_generic"],
      );
    }
  };

  const handleRemove = async (domain: string) => {
    if (!domain || loading) return;
    setLocalStatus("saving");
    setLocalMsg(null);
    try {
      await removeCustomDomainClient(siteId, domain);
      setLocalStatus("success");
      setLocalMsg(
        translations["builder.domain.custom_domain_removed"] || "Removed!",
      );
      await refetchDomains();
    } catch (err) {
      setLocalStatus("error");
      setLocalMsg(
        err instanceof Error
          ? err.message
          : translations["builder.domain.error_generic"],
      );
    }
  };

  return (
    <section className="mt-8">
      <h4 className="font-semibold mb-2">
        {translations["builder.domain.custom_domain_title"]}
      </h4>

      {!isPaid ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded text-gray-500">
          <span aria-hidden className="inline-block text-xl">
            🔒
          </span>
          <span>{translations["builder.domain.custom_domain_locked"]}</span>
          <button
            className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={onUpgradeClick}
            type="button"
          >
            {translations["builder.domain.upgrade_btn"]}
          </button>
        </div>
      ) : (
        <>
          <form
            className="flex flex-col gap-2 max-w-lg"
            onSubmit={handleAddDomain}
          >
            <label className="sr-only" htmlFor="custom-domain-input">
              {translations["builder.domain.custom_domain_placeholder"]}
            </label>
            <input
              id="custom-domain-input"
              type="text"
              className="border px-2 py-1 rounded w-72"
              placeholder={
                translations["builder.domain.custom_domain_placeholder"]
              }
              disabled={loading || localStatus === "saving"}
              value={inputDomain}
              onChange={(e) => {
                setInputDomain(e.target.value.trim());
                setLocalStatus("");
                setLocalMsg(null);
              }}
              aria-label={
                translations["builder.domain.custom_domain_placeholder"]
              }
              autoComplete="off"
            />
            {!!localMsg && (
              <div
                className={`text-xs mt-1 ${
                  localStatus === "success"
                    ? "text-green-700"
                    : localStatus === "error"
                      ? "text-red-600"
                      : ""
                }`}
              >
                {localMsg}
              </div>
            )}

            <button
              className="mt-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500"
              type="submit"
              disabled={loading || !inputDomain}
            >
              {translations["builder.domain.save_btn"]}
            </button>
          </form>

          {/* List current domains */}
          {(verifiedDomains.length > 0 || pendingDomains.length > 0) && (
            <div className="mt-6">
              <h5 className="font-semibold mb-1">
                {translations["builder.domain.custom_domain_list_title"] ||
                  "Your domains"}
              </h5>
              <ul className="divide-y border rounded bg-gray-50">
                {[...verifiedDomains, ...pendingDomains].map((domain) => (
                  <React.Fragment key={domain}>
                    <li className="flex items-center px-3 py-2 justify-between">
                      <span>
                        {domain}
                        {domainStatuses[domain] && (
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded
            ${
              domainStatuses[domain] === "verified"
                ? "bg-green-100 text-green-800"
                : domainStatuses[domain] === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
                          >
                            {translations[
                              `builder.domain.status_${domainStatuses[domain]}`
                            ] || domainStatuses[domain]}
                          </span>
                        )}
                        {domainStatuses[domain] !== "verified" && (
                          <button
                            type="button"
                            disabled={loading || localStatus === "saving"}
                            className="ml-2 text-xs text-blue-600 underline"
                            style={{ minWidth: 80 }}
                            onClick={() => handleCheckStatus(domain)}
                          >
                            {translations["builder.domain.check_status_btn"] ||
                              "Check status"}
                          </button>
                        )}
                      </span>
                      <button
                        type="button"
                        disabled={loading || localStatus === "saving"}
                        className="text-red-500 hover:underline ml-4 text-xs"
                        onClick={() => handleRemove(domain)}
                      >
                        {translations["builder.domain.remove_btn"] || "Remove"}
                      </button>
                    </li>

                    {/* Only for NOT verified domains: show DNS instructions/error after Check status */}
                    {domainStatuses[domain] === "verified" && (
                      <div className="px-6 pb-2 pt-2 text-xs rounded-b bg-green-50 border-b border-green-200 flex flex-col gap-2">
                        <span className="text-green-700 font-semibold">
                          {translations["builder.domain.verified_message"] ||
                            "Domain is live and connected!"}
                        </span>
                        <a
                          href={`https://${domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {translations["builder.domain.go_to_domain"] ||
                            "Visit domain"}
                        </a>
                        <div className="mt-2 text-gray-700 bg-yellow-50 rounded px-2 py-1 text-xs">
                          {translations["builder.domain.missing_dns_help"] ||
                            "If your domain does not resolve, please make sure you have added the correct DNS records. For example:"}
                          <pre>
                            {
                              "A    @     76.76.21.21\nCNAME    www    cname.vercel-dns.com"
                            }
                          </pre>
                          <div>
                            <a
                              href="https://vercel.com/docs/concepts/projects/custom-domains#step-2--add-your-domain-to-vercel"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {translations["builder.domain.vercel_dns_help"] ||
                                "View Vercel DNS setup guide"}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CustomDomainSection;
