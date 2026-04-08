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
  domainProviderApiUrl,
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

  React.useEffect(() => {
    if (skipNextPropSyncRef.current) {
      skipNextPropSyncRef.current = false;
      return;
    }
    setVerifiedDomains(verifiedDomainsProp);
    setPendingDomains(pendingDomainsProp);
    setDomainStatuses(domainStatusesProp);
  }, [verifiedDomainsProp, pendingDomainsProp, domainStatusesProp]);

  const userIsPremium = planType !== "free";
  const allDomains = Array.from(
    new Set([...verifiedDomains, ...pendingDomains].map(toApexDomain)),
  ).filter(Boolean);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalStatus("saving");
    setLocalMsg(null);
    setDomainError(null);
    let addSucceeded = false;

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
      await addCustomDomainClient(siteId, inputDomain);
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
      const checkMsg =
        translations["builder.domain.custom_domain_checked"] ||
        "Status checked!";
      setLocalMsg(checkMsg);
      notify.success(checkMsg);
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
      <Heading as="h3" className="font-semibold text-gray-900 pb-2">
        {translations["builder.domain.custom_domain_title"] || "Custom Domain"}
      </Heading>

      {/* Dynamic Subtitles applied here */}
      <p className="text-sm text-gray-500 mb-4 max-w-xl">
        {userIsPremium
          ? translations["builder.domain.custom_subtitle_premium"] ||
            "Connect your own personal domain (e.g., yourname.com) for a cleaner look and easier guest access."
          : translations["builder.domain.custom_subtitle_free"] ||
            "Upgrade to Premium to unlock a custom domain and remove 'weddweb' from your professional web address."}
      </p>

      {!userIsPremium ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3 text-gray-500 flex-1">
            <span aria-hidden className="text-xl">
              🔒
            </span>
            <span className="text-sm font-medium">
              {translations["builder.domain.custom_domain_locked"] ||
                "Custom domain feature is locked."}
            </span>
          </div>
          <BuilderButton
            size="sm"
            onClick={onUpgradeClick}
            type="button"
            className="w-full sm:w-auto"
          >
            {translations["builder.domain.upgrade_btn"] ?? "Upgrade Now"}
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
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="custom-domain-input"
                type="text"
                className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="yourwedding.com"
                disabled={loading || localStatus === "saving"}
                value={inputDomain}
                onChange={(e) => {
                  setInputDomain(e.target.value.trim());
                  setLocalStatus("");
                  setLocalMsg(null);
                  setDomainError(null);
                }}
                autoComplete="off"
              />
              <BuilderButton
                type="submit"
                disabled={loading || !inputDomain || localStatus === "saving"}
                className="whitespace-nowrap"
              >
                {translations["builder.domain.save_btn"]}
              </BuilderButton>
            </div>

            {!!localMsg && (
              <div
                className={`text-xs mt-1 ${localStatus === "success" ? "text-green-700" : "text-red-500"}`}
              >
                {localMsg}
              </div>
            )}
            {!!domainError && (
              <div className="text-xs mt-1 text-red-500">{domainError}</div>
            )}
          </form>

          {allDomains.length > 0 && (
            <div className="mt-8">
              <h5 className="font-semibold text-gray-900 mb-3">
                {translations["builder.domain.custom_domain_list_title"] ||
                  "Connected Domains"}
              </h5>
              <ul className="divide-y border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                {allDomains.map((domain) => (
                  <React.Fragment key={domain}>
                    <li className="flex items-center px-4 py-3 justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">
                          {domain}
                        </span>
                        {(domainStatuses[domain] ||
                          domainStatuses[`www.${domain}`]) && (
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              (domainStatuses[domain] ||
                                domainStatuses[`www.${domain}`]) === "verified"
                                ? "bg-green-100 text-green-700"
                                : (domainStatuses[domain] ||
                                      domainStatuses[`www.${domain}`]) ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {translations[
                              `builder.domain.status_${domainStatuses[domain] || domainStatuses[`www.${domain}`]}`
                            ] ||
                              domainStatuses[domain] ||
                              domainStatuses[`www.${domain}`]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(domainStatuses[domain] ||
                          domainStatuses[`www.${domain}`]) !== "verified" && (
                          <BuilderButton
                            type="button"
                            disabled={loading || localStatus === "saving"}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCheckStatus(domain)}
                          >
                            {translations["builder.domain.check_status_btn"] ||
                              "Refresh"}
                          </BuilderButton>
                        )}
                        <BuilderButton
                          type="button"
                          disabled={loading || localStatus === "saving"}
                          variant="secondary"
                          tone="danger"
                          size="sm"
                          onClick={() => handleRemove(domain)}
                        >
                          {translations["builder.domain.remove_btn"] ||
                            "Remove"}
                        </BuilderButton>
                      </div>
                    </li>

                    {/* Verified UI */}
                    {(domainStatuses[domain] ||
                      domainStatuses[`www.${domain}`]) === "verified" && (
                      <li className="bg-green-50/50 px-4 py-3 border-t border-green-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-xs text-green-800">
                            <p className="font-semibold mb-0.5">
                              {translations[
                                "builder.domain.verified_message"
                              ] || "Your domain is live!"}
                            </p>
                            <p>
                              {translations["builder.domain.did_you_add_dns"] ||
                                "Everything looks good."}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <BuilderButton
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                window.open(`https://${domain}`, "_blank")
                              }
                            >
                              {translations["builder.domain.go_to_domain"] ||
                                "Visit Site"}
                            </BuilderButton>
                            <BuilderButton
                              size="sm"
                              variant="secondary"
                              onClick={() => setDnsModalDomain(domain)}
                            >
                              {translations["builder.domain.no_show_how"] ||
                                "Instructions"}
                            </BuilderButton>
                          </div>
                        </div>
                      </li>
                    )}

                    {/* Pending DNS View */}
                    {domainStatuses[domain] !== "verified" &&
                      domainInfo[domain]?.dnsInstructions && (
                        <li className="bg-blue-50/30 px-4 py-3 border-t border-blue-100">
                          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-tight mb-2">
                            {translations[
                              "builder.domain.dns_instructions_label"
                            ] || "DNS Records Required"}
                          </p>
                          <div className="bg-white border border-blue-100 rounded-md p-3 font-mono text-[11px] text-blue-900 overflow-x-auto">
                            {domainInfo[domain].dnsInstructions
                              .split("\n")
                              .map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))}
                          </div>
                        </li>
                      )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* DNS Modal */}
      <MainModal
        open={!!dnsModalDomain}
        title={
          translations["builder.domain.dns_modal_title"] ||
          "Connect Your Domain"
        }
        onClose={() => setDnsModalDomain(null)}
      >
        <DnsModalContent
          translations={translations}
          domainName={dnsModalDomain ?? ""}
          domainConnectId={domainProviderApiUrl ?? undefined}
        />
      </MainModal>
    </section>
  );
};

export default CustomDomainSection;
