"use client";

import React, { useState } from "react";
import { addCustomDomainClient } from "@/2-features/custom-domain/api/addCustomDomain.client";
import { removeCustomDomainClient } from "@/2-features/custom-domain/api/removeCustomDomain.client";
import { verifyCustomDomainClient } from "@/2-features/custom-domain/api/verifyCustomDomain.client";
import MainModal from "@/4-shared/ui/modals/MainModal";
import DnsModalContent from "@/2-features/custom-domain/components/DnsModalContent";
import { notify } from "@/4-shared/lib/toast/toast";
import { PlanType } from "@/4-shared/types";

interface Props {
  planType: PlanType;
  translations: Record<string, string>;
  siteId: string;
  verifiedDomains: string[];
  pendingDomains: string[];
  domainStatuses: Record<string, string>;
  onUpgradeClick: () => void;
  refetchDomains: () => Promise<void>;
  loading?: boolean;
}

export const CustomDomainSection: React.FC<Props> = ({
  planType,
  translations,
  siteId,
  verifiedDomains: verifiedDomainsProp,
  pendingDomains: pendingDomainsProp,
  domainStatuses: domainStatusesProp,
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
  const [dnsModalDomain, setDnsModalDomain] = useState<string | null>(null);

  // Local state for optimistic UI
  const [verifiedDomains, setVerifiedDomains] =
    useState<string[]>(verifiedDomainsProp);
  const [pendingDomains, setPendingDomains] =
    useState<string[]>(pendingDomainsProp);
  const [domainStatuses, setDomainStatuses] =
    useState<Record<string, string>>(domainStatusesProp);

  // Sync local state with props after backend update
  React.useEffect(() => {
    setVerifiedDomains(verifiedDomainsProp);
    setPendingDomains(pendingDomainsProp);
    setDomainStatuses(domainStatusesProp);
  }, [verifiedDomainsProp, pendingDomainsProp, domainStatusesProp]);

  const isPaid = planType !== "free";
  const allDomains = [...verifiedDomains, ...pendingDomains];

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalStatus("saving");
    setLocalMsg(null);

    // Optimistically update UI
    setPendingDomains((prev) => [...prev, inputDomain]);
    setDomainStatuses((prev) => ({ ...prev, [inputDomain]: "pending" }));

    try {
      await addCustomDomainClient(siteId, inputDomain); // Only user input—let backend handle variants/redirect/delay!
      setLocalStatus("success");
      setInputDomain("");
      notify.success(translations["builder.domain.custom_domain_success"]);
    } catch (err: unknown) {
      setLocalStatus("error");
      let msg = "";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        msg = (err as { message: string }).message;
      } else if (typeof err === "string") {
        msg = err;
      } else {
        msg = translations["builder.domain.error_generic"] || "Server error";
      }
      notify.error(msg);
    } finally {
      await refetchDomains();
    }
  };
  const handleRemove = async (domain: string) => {
    if (!domain || loading) return;
    setLocalStatus("saving");
    setLocalMsg(null);
    // Optimistically update UI
    setVerifiedDomains((prev) => prev.filter((d) => d !== domain));
    setPendingDomains((prev) => prev.filter((d) => d !== domain));
    setDomainStatuses((prev) => {
      const copy = { ...prev };
      delete copy[domain];
      return copy;
    });
    try {
      await removeCustomDomainClient(siteId, domain);
      setLocalStatus("success");

      notify.success(translations["builder.domain.custom_domain_removed"]);
    } catch (err) {
      setLocalStatus("error");

      notify.error(
        err instanceof Error
          ? err.message
          : translations["builder.domain.error_generic"],
      );
    } finally {
      await refetchDomains();
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
          "Status checked. Refresh the page now.",
      );
      notify.success(
        translations["builder.domain.custom_domain_checked"] ||
          "Status checked. Refresh the page now.",
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

          {allDomains.length > 0 && (
            <div className="mt-6">
              <h5 className="font-semibold mb-1">
                {translations["builder.domain.custom_domain_list_title"] ||
                  "Your domains"}
              </h5>
              <ul className="divide-y border rounded bg-gray-50">
                {allDomains.map((domain) => (
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

                    {/* Verified domain: onboarding UX */}
                    {domainStatuses[domain] === "verified" && (
                      <div className="px-6 pb-2 pt-2 text-xs rounded-b bg-green-50 border-b border-green-200 flex flex-col gap-2">
                        <span className="text-green-700 font-semibold">
                          {translations["builder.domain.verified_message"] ||
                            "Domain is live and connected!"}
                        </span>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6 items-center">
                          <span>
                            {translations["builder.domain.did_you_add_dns"] ||
                              "Did you already add the correct DNS records at your provider?"}
                          </span>
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <a
                              href={`https://${domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                              {translations["builder.domain.go_to_domain"] ||
                                "Yes, Visit my website"}
                            </a>
                            <button
                              type="button"
                              className="px-4 py-1 bg-gray-100 border rounded hover:bg-gray-200"
                              onClick={() => setDnsModalDomain(domain)}
                            >
                              {translations["builder.domain.no_show_how"] ||
                                "No, show me how"}
                            </button>
                          </div>
                        </div>
                        <MainModal
                          open={dnsModalDomain === domain}
                          title={
                            translations["builder.domain.dns_modal_title"] ||
                            "How to connect your domain"
                          }
                          onClose={() => setDnsModalDomain(null)}
                        >
                          <DnsModalContent domain={domain} />
                        </MainModal>
                      </div>
                    )}

                    {/* Show DNS instructions + error for PENDING/ERROR */}
                    {domainStatuses[domain] !== "verified" &&
                      domainInfo[domain]?.dnsInstructions && (
                        <div className="px-6 pb-2 pt-2 text-xs whitespace-pre-wrap bg-blue-50 border-b border-blue-200 rounded-b">
                          <strong>
                            {translations[
                              "builder.domain.dns_instructions_label"
                            ] || "DNS Instructions:"}
                          </strong>
                          <br />
                          {domainInfo[domain].dnsInstructions
                            .split("\n")
                            .map((line, idx) => (
                              <div key={idx}>{line}</div>
                            ))}
                          {domainInfo[domain]?.error && (
                            <div className="text-red-600 mt-2">
                              {translations["builder.domain.dns_error"] ||
                                "Error:"}{" "}
                              {domainInfo[domain].error}
                            </div>
                          )}
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
