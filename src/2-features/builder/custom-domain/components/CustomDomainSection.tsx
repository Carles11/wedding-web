"use client";

import { addCustomDomainClient } from "@/2-features/builder/custom-domain/api/addCustomDomain.client";
import { removeCustomDomainClient } from "@/2-features/builder/custom-domain/api/removeCustomDomain.client";
import { verifyCustomDomainClient } from "@/2-features/builder/custom-domain/api/verifyCustomDomain.client";
import DnsModalContent from "@/2-features/builder/custom-domain/components/DnsModalContent";
import { getDomainVariants } from "@/4-shared/helpers/domains/getDomainVariants";
import { toApexDomain } from "@/4-shared/helpers/domains/toApexDomain";
import { notify } from "@/4-shared/lib/toast/toast";
import { CustomDomainSectionProps } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import React, { useState } from "react";

export const CustomDomainSection: React.FC<CustomDomainSectionProps> = ({
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
  const [domainError, setDomainError] = useState<string | null>(null);
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
  const skipNextPropSyncRef = React.useRef(false);

  const scheduleFollowUpRefetch = () => {
    window.setTimeout(() => {
      void refetchDomains();
    }, 1200);
  };

  // Sync local state with props after backend update
  React.useEffect(() => {
    if (skipNextPropSyncRef.current) {
      skipNextPropSyncRef.current = false;
      return;
    }
    setVerifiedDomains(verifiedDomainsProp);
    setPendingDomains(pendingDomainsProp);
    setDomainStatuses(domainStatusesProp);
  }, [verifiedDomainsProp, pendingDomainsProp, domainStatusesProp]);

  const isPaid = planType !== "free";
  const allDomains = Array.from(
    new Set([...verifiedDomains, ...pendingDomains].map(toApexDomain)),
  ).filter(Boolean);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalStatus("saving");
    setLocalMsg(null);
    setDomainError(null);
    let addSucceeded = false;

    // Domain format validation
    // Import isValidDomain from validations
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isValidDomain } = require("@/4-shared/utils/validations/domain");
    if (!isValidDomain(inputDomain)) {
      setLocalStatus("error");
      setDomainError(
        translations["builder.domain.invalid_domain"] ||
          "Invalid domain format. Please enter a valid domain.",
      );
      return;
    }

    const { apex } = getDomainVariants(inputDomain);

    // Optimistically update UI
    setPendingDomains((prev) => {
      const next = [...prev.filter((d) => toApexDomain(d) !== apex), apex];
      return Array.from(new Set(next));
    });
    setDomainStatuses((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([key]) => toApexDomain(key) !== apex),
      );
      return { ...next, [apex]: "pending" };
    });

    try {
      await addCustomDomainClient(siteId, inputDomain); // Only user input—let backend handle variants/redirect/delay!
      addSucceeded = true;
      skipNextPropSyncRef.current = true;
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
      if (addSucceeded) {
        scheduleFollowUpRefetch();
      }
    }
  };
  const handleRemove = async (domain: string) => {
    if (!domain || loading) return;
    setLocalStatus("saving");
    setLocalMsg(null);
    let removeSucceeded = false;
    const { apex } = getDomainVariants(domain);

    // Optimistically update UI
    setVerifiedDomains((prev) => prev.filter((d) => toApexDomain(d) !== apex));
    setPendingDomains((prev) => prev.filter((d) => toApexDomain(d) !== apex));
    setDomainStatuses((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([key]) => toApexDomain(key) !== apex),
      );
    });
    try {
      await removeCustomDomainClient(siteId, apex);
      removeSucceeded = true;
      skipNextPropSyncRef.current = true;
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
      if (removeSucceeded) {
        scheduleFollowUpRefetch();
      }
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
      <Heading as="h3" className="font-semibold text-gray-900 pb-4">
        {translations["builder.domain.custom_domain_title"]}
      </Heading>

      {!isPaid ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded text-gray-500">
          <span aria-hidden className="inline-block text-xl">
            🔒
          </span>
          <span>{translations["builder.domain.custom_domain_locked"]}</span>
          <BuilderButton
            className="ml-auto"
            size="sm"
            onClick={onUpgradeClick}
            type="button"
          >
            {translations["builder.domain.upgrade_btn"] ?? "Upgrade"}
          </BuilderButton>
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
                setDomainError(null);
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
                      ? "text-(--builder-color-danger)"
                      : ""
                }`}
              >
                {localMsg}
              </div>
            )}
            {!!domainError && (
              <div className="text-xs mt-1 text-(--builder-color-danger)">
                {domainError}
              </div>
            )}
            <BuilderButton
              className="mt-1 w-72"
              type="submit"
              disabled={loading || !inputDomain}
            >
              {translations["builder.domain.save_btn"]}
            </BuilderButton>
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
                        {(domainStatuses[domain] ||
                          domainStatuses[`www.${domain}`]) && (
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded
                              ${
                                (domainStatuses[domain] ||
                                  domainStatuses[`www.${domain}`]) ===
                                "verified"
                                  ? "bg-green-100 text-green-800"
                                  : (domainStatuses[domain] ||
                                        domainStatuses[`www.${domain}`]) ===
                                      "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                          >
                            {translations[
                              `builder.domain.status_${domainStatuses[domain] || domainStatuses[`www.${domain}`]}`
                            ] ||
                              domainStatuses[domain] ||
                              domainStatuses[`www.${domain}`]}
                          </span>
                        )}
                        {(domainStatuses[domain] ||
                          domainStatuses[`www.${domain}`]) !== "verified" && (
                          <BuilderButton
                            type="button"
                            disabled={loading || localStatus === "saving"}
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            style={{ minWidth: 80 }}
                            onClick={() => handleCheckStatus(domain)}
                          >
                            {translations["builder.domain.check_status_btn"] ||
                              "Check status"}
                          </BuilderButton>
                        )}
                      </span>
                      <BuilderButton
                        type="button"
                        disabled={loading || localStatus === "saving"}
                        variant="secondary"
                        tone="danger"
                        size="sm"
                        className="ml-4"
                        onClick={() => handleRemove(domain)}
                      >
                        {translations["builder.domain.remove_btn"] || "Remove"}
                      </BuilderButton>
                    </li>

                    {/* Verified domain: onboarding UX */}
                    {(domainStatuses[domain] ||
                      domainStatuses[`www.${domain}`]) === "verified" && (
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
                            <BuilderButton
                              type="button"
                              variant="primary"
                              onClick={() =>
                                window.open(
                                  `https://${domain}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              {translations["builder.domain.go_to_domain"] ||
                                "Yes, Visit my website"}
                            </BuilderButton>
                            <BuilderButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setDnsModalDomain(domain)}
                            >
                              {translations["builder.domain.no_show_how"] ||
                                "No, show me how"}
                            </BuilderButton>
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
                          <DnsModalContent translations={translations} />
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
                            <div className="text-(--builder-color-danger) mt-2">
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
