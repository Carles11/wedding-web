"use client";

import { addCustomDomainClient } from "@/2-features/builder/custom-domain/api/addCustomDomain.client";
import { removeCustomDomainClient } from "@/2-features/builder/custom-domain/api/removeCustomDomain.client";
import { verifyCustomDomainClient } from "@/2-features/builder/custom-domain/api/verifyCustomDomain.client";
import DnsModalContent from "@/2-features/builder/custom-domain/components/DnsModalContent";
import RemoveDomainConfirmModal from "@/2-features/builder/custom-domain/components/RemoveDomainConfirmModal";
import { getDomainVariants } from "@/4-shared/helpers/domains/getDomainVariants";
import { toApexDomain } from "@/4-shared/helpers/domains/toApexDomain";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { CustomDomainSectionProps } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
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
  const [domainToRemove, setDomainToRemove] = useState<string | null>(null);

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

  // Silent background re-check for verified domains on mount.
  // Catches DNS regressions (e.g. user removed records after going live).
  const bgCheckRanRef = React.useRef(false);
  React.useEffect(() => {
    if (bgCheckRanRef.current) return;
    const verifiedApex = allDomains.filter(
      (d) => (domainStatuses[d] || domainStatuses[`www.${d}`]) === "verified",
    );
    if (verifiedApex.length === 0) return;
    bgCheckRanRef.current = true;

    (async () => {
      for (const domain of verifiedApex) {
        try {
          const result = await verifyCustomDomainClient(siteId, domain);
          if (result.status && result.status !== "verified") {
            setDomainStatuses((prev) => ({
              ...prev,
              [domain]: result.status,
            }));
            setDomainInfo((old) => ({
              ...old,
              [domain]: {
                status: result.status,
                dnsInstructions: result.dnsInstructions || null,
                error: result.error || null,
              },
            }));
          }
        } catch {
          // Silent — don't disrupt UX on transient network errors
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        t(
          translations,
          "builder.domain.invalid_domain",
          "Invalid domain format. Please enter a valid domain.",
        ),
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
      notify.success(
        t(
          translations,
          "builder.domain.custom_domain_success",
          "Domain added successfully!",
        ),
      );
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
        msg = t(translations, "builder.domain.error_generic", "Server error");
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

    setDomainToRemove(null);
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
      notify.success(
        t(
          translations,
          "builder.domain.custom_domain_removed",
          "Domain removed successfully.",
        ),
      );
    } catch (err) {
      setLocalStatus("error");
      notify.error(
        err instanceof Error
          ? err.message
          : t(translations, "builder.domain.error_generic", "Server error"),
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
          error: result.error || null,
        },
      }));

      // Optimistically update local status to reflect the server response
      if (result.status) {
        setDomainStatuses((prev) => ({ ...prev, [domain]: result.status }));
      }

      setLocalStatus("success");
      const checkMsg = t(
        translations,
        "builder.domain.custom_domain_checked",
        "Status checked!",
      );
      setLocalMsg(checkMsg);
      notify.success(checkMsg);
      await refetchDomains();
    } catch (err) {
      setLocalStatus("error");
      setLocalMsg(
        err instanceof Error
          ? err.message
          : t(translations, "builder.domain.error_generic", "Server error"),
      );
    }
  };

  /**
   * Resolves the effective domain status from DB statuses or the latest
   * server response stored in domainInfo.
   */
  const getEffectiveStatus = (domain: string) => {
    const dbStatus =
      domainStatuses[domain] || domainStatuses[`www.${domain}`] || "";
    const infoStatus = domainInfo[domain]?.status || "";
    // Prefer the freshest signal: domainInfo is set after a check-status call
    return infoStatus || dbStatus;
  };

  return (
    <section className="mt-8">
      <Heading as="h3" className="font-semibold text-gray-900 dark:text-gray-100 pb-2">
        {t(translations, "builder.domain.custom_domain_title", "Custom Domain")}
      </Heading>

      {/* Dynamic Subtitles applied here */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xl">
        {userIsPremium
          ? t(
              translations,
              "builder.domain.custom_subtitle_premium",
              "Connect your own personal domain (e.g., yourname.com) for a cleaner look and easier guest access.",
            )
          : t(
              translations,
              "builder.domain.custom_subtitle_free",
              "Upgrade to Premium to unlock a custom domain and remove 'weddweb' from your professional web address.",
            )}
      </p>

      {!userIsPremium ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 flex-1">
            <span aria-hidden className="text-xl">
              🔒
            </span>
            <span className="text-sm font-medium">
              {t(
                translations,
                "builder.domain.custom_domain_locked",
                "Custom domain feature is locked.",
              )}
            </span>
          </div>
          <BuilderButton
            size="sm"
            onClick={onUpgradeClick}
            type="button"
            className="w-full sm:w-auto"
          >
            {t(translations, "builder.domain.upgrade_btn", "Upgrade Now")}
          </BuilderButton>
        </div>
      ) : (
        <>
          <form
            className="flex flex-col gap-2 max-w-lg"
            onSubmit={handleAddDomain}
          >
            <label className="sr-only" htmlFor="custom-domain-input">
              {t(
                translations,
                "builder.domain.custom_domain_placeholder",
                "Enter your domain",
              )}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="custom-domain-input"
                type="text"
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
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
                {t(translations, "builder.domain.save_btn", "Save")}
              </BuilderButton>
            </div>

            {!!localMsg && (
              <div
                className={`text-xs mt-1 ${localStatus === "success" ? "text-green-700 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
              >
                {localMsg}
              </div>
            )}
            {!!domainError && (
              <div className="text-xs mt-1 text-red-500 dark:text-red-400">{domainError}</div>
            )}
          </form>

          {allDomains.length > 0 && (
            <div className="mt-8">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t(
                  translations,
                  "builder.domain.custom_domain_list_title",
                  "Connected Domains",
                )}
              </h5>
              <ul className="divide-y border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                {allDomains.map((domain) => {
                  const status = getEffectiveStatus(domain);
                  const info = domainInfo[domain];

                  // Badge configuration per state
                  const badgeConfig: Record<
                    string,
                    {
                      className: string;
                      icon: React.ReactNode;
                      label: string;
                    }
                  > = {
                    verified: {
                      className: "bg-green-100 text-green-700 dark:text-green-400 dark:bg-green-950/40",
                      icon: (
                        <CheckCircle2
                          size={12}
                          className="inline mr-1 -mt-px"
                        />
                      ),
                      label: t(
                        translations,
                        "builder.domain.status_live",
                        "Live",
                      ),
                    },
                    pending_certificate: {
                      className: "bg-blue-100 text-blue-700 dark:text-blue-400 dark:bg-blue-950/40",
                      icon: (
                        <RefreshCw
                          size={12}
                          className="inline mr-1 -mt-px animate-spin"
                        />
                      ),
                      label: t(
                        translations,
                        "builder.domain.status_pending_ssl",
                        "Almost Ready",
                      ),
                    },
                    pending: {
                      className: "bg-yellow-100 text-yellow-700 dark:text-yellow-400 dark:bg-yellow-950/40",
                      icon: (
                        <AlertCircle size={12} className="inline mr-1 -mt-px" />
                      ),
                      label: t(
                        translations,
                        "builder.domain.status_pending_dns",
                        "DNS Required",
                      ),
                    },
                    error: {
                      className: "bg-red-100 text-red-700 dark:text-red-400 dark:bg-red-950/40",
                      icon: (
                        <XCircle size={12} className="inline mr-1 -mt-px" />
                      ),
                      label: t(
                        translations,
                        "builder.domain.status_error",
                        "Error",
                      ),
                    },
                  };

                  const badge = badgeConfig[status] ?? badgeConfig["pending"];
                  const showRefresh = status !== "verified";

                  return (
                    <React.Fragment key={domain}>
                      {/* Domain row */}
                      <li className="flex items-center px-4 py-3 justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {domain}
                          </span>
                          {status && (
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-flex items-center ${badge.className}`}
                            >
                              {badge.icon}
                              {badge.label}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {showRefresh && (
                            <BuilderButton
                              type="button"
                              disabled={loading || localStatus === "saving"}
                              variant="secondary"
                              size="sm"
                              onClick={() => handleCheckStatus(domain)}
                            >
                              {t(
                                translations,
                                "builder.domain.check_status_btn",
                                "Refresh",
                              )}
                            </BuilderButton>
                          )}
                          <BuilderButton
                            type="button"
                            disabled={loading || localStatus === "saving"}
                            variant="secondary"
                            tone="danger"
                            size="sm"
                            onClick={() => setDomainToRemove(domain)}
                          >
                            {t(
                              translations,
                              "builder.domain.remove_btn",
                              "Remove",
                            )}
                          </BuilderButton>
                        </div>
                      </li>

                      {/* State C: Verified / Live */}
                      {status === "verified" && (
                        <li className="bg-green-50/50 dark:bg-green-950/30 px-4 py-3 border-t border-green-100 dark:border-green-800/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-2 text-xs text-green-800 dark:text-green-400">
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0"
                              />
                              <div>
                                <p className="font-semibold mb-0.5">
                                  {t(
                                    translations,
                                    "builder.domain.verified_message",
                                    "Your domain is live!",
                                  )}
                                </p>
                                <p>
                                  {t(
                                    translations,
                                    "builder.domain.verified_subtitle",
                                    "Everything is configured correctly. Your guests can access your site at this address.",
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <BuilderButton
                                size="sm"
                                variant="primary"
                                onClick={() =>
                                  window.open(`https://${domain}`, "_blank")
                                }
                              >
                                {t(
                                  translations,
                                  "builder.domain.visit_site",
                                  "Visit Site",
                                )}
                              </BuilderButton>
                              <BuilderButton
                                size="sm"
                                variant="secondary"
                                onClick={() => setDnsModalDomain(domain)}
                              >
                                {t(
                                  translations,
                                  "builder.domain.dns_settings",
                                  "DNS Settings",
                                )}
                              </BuilderButton>
                            </div>
                          </div>
                        </li>
                      )}

                      {/* State B: SSL Pending / Almost Ready */}
                      {status === "pending_certificate" && (
                        <li className="bg-blue-50/50 dark:bg-blue-950/30 px-4 py-3 border-t border-blue-100 dark:border-blue-800/50">
                          <div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-400">
                            <RefreshCw
                              size={16}
                              className="mt-0.5 shrink-0 animate-spin"
                            />
                            <div>
                              <p className="font-semibold mb-0.5">
                                {t(
                                  translations,
                                  "builder.domain.status_pending_ssl",
                                  "Almost Ready",
                                )}
                              </p>
                              <p>
                                {t(
                                  translations,
                                  "builder.domain.message_pending_ssl",
                                  "DNS is configured correctly. SSL certificate is being generated — this usually takes a minute.",
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      )}

                      {/* State A: DNS Required */}
                      {status === "pending" && (
                        <li className="bg-yellow-50/50 dark:bg-amber-950/30 px-4 py-3 border-t border-yellow-100 dark:border-yellow-800/50">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2 text-xs text-yellow-800 dark:text-yellow-400">
                              <AlertCircle
                                size={16}
                                className="mt-0.5 shrink-0"
                              />
                              <div>
                                <p className="font-semibold mb-0.5">
                                  {t(
                                    translations,
                                    "builder.domain.dns_instructions_label",
                                    "DNS Instructions",
                                  )}
                                </p>
                                <p>
                                  {t(
                                    translations,
                                    "builder.domain.dns_modal.section_diy",
                                    "Add these records at your registrar",
                                  )}
                                </p>
                              </div>
                            </div>
                            {info?.dnsInstructions && (
                              <div className="bg-white dark:bg-gray-800 border border-yellow-100 dark:border-yellow-800/50 rounded-md p-3 font-mono text-[11px] text-yellow-900 dark:text-yellow-400 overflow-x-auto">
                                {info.dnsInstructions
                                  .split("\n")
                                  .map((line, idx) => (
                                    <div key={idx}>{line}</div>
                                  ))}
                              </div>
                            )}
                            <BuilderButton
                              size="sm"
                              variant="secondary"
                              onClick={() => setDnsModalDomain(domain)}
                              className="w-fit ml-4"
                            >
                              {t(
                                translations,
                                "builder.domain.show_instructions",
                                "Show me how",
                              )}
                            </BuilderButton>
                          </div>
                        </li>
                      )}

                      {/* State D: Error */}
                      {status === "error" && (
                        <li className="bg-red-50/50 dark:bg-red-950/30 px-4 py-3 border-t border-red-100 dark:border-red-800/50">
                          <div className="flex items-start gap-2 text-xs text-red-800 dark:text-red-400">
                            <XCircle size={16} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="font-semibold mb-0.5">
                                {t(
                                  translations,
                                  "builder.domain.status_action_required",
                                  "Action Required",
                                )}
                              </p>
                              <p>
                                {info?.error ||
                                  t(
                                    translations,
                                    "builder.domain.error_generic",
                                    "There was a problem verifying your domain. Please check your DNS configuration.",
                                  )}
                              </p>
                              {info?.dnsInstructions && (
                                <div className="mt-2 bg-white dark:bg-gray-800 border border-red-100 dark:border-red-800/50 rounded-md p-3 font-mono text-[11px] text-red-900 dark:text-red-400 overflow-x-auto">
                                  {info.dnsInstructions
                                    .split("\n")
                                    .map((line, idx) => (
                                      <div key={idx}>{line}</div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      )}
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      {/* DNS Modal */}
      <MainModal
        open={!!dnsModalDomain}
        title={t(
          translations,
          "builder.domain.dns_modal_title",
          "Connect Your Domain",
        )}
        onClose={() => setDnsModalDomain(null)}
      >
        <DnsModalContent
          translations={translations}
          domainName={dnsModalDomain ?? ""}
        />
      </MainModal>

      <RemoveDomainConfirmModal
        open={!!domainToRemove}
        domain={domainToRemove}
        translations={translations}
        loading={loading || localStatus === "saving"}
        onClose={() => setDomainToRemove(null)}
        onConfirm={() => {
          if (domainToRemove) {
            void handleRemove(domainToRemove);
          }
        }}
      />
    </section>
  );
};

export default CustomDomainSection;
