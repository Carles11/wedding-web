"use client";

import MembershipSection from "@/2-features/builder/billing/ui/MembershipSection";
import CustomDomainSection from "@/2-features/builder/custom-domain/components/CustomDomainSection";
import SubdomainManager from "@/2-features/builder/custom-domain/components/SubdomainManager";
import { notify } from "@/4-shared/lib/toast/toast";
import type { DomainAndBillingBuilderStepProps } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { copyToClipboard } from "@/4-shared/utils/copyToClipboard";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ShareTarget = {
  id: string;
  label: string;
  description: string;
  url: string | null;
  shareText: string;
};

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
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const primaryCustomDomain =
    verifiedDomains.find((domain) => !domain.startsWith("www.")) ??
    verifiedDomains[0] ??
    null;

  const shareTargets: ShareTarget[] = [
    {
      id: "subdomain",
      label: translations["builder.share.subdomain_label"] || "Share subdomain",
      description:
        translations["builder.share.subdomain_desc"] ||
        "Use your public WeddWeb subdomain for guests.",
      url: site.subdomain ? `https://${site.subdomain}.weddweb.com` : null,
      shareText: site.title
        ? `Take a look at our wedding site on WeddWeb: ${site.title}`
        : "Take a look at our wedding site on WeddWeb.",
    },
    {
      id: "custom-domain",
      label:
        translations["builder.share.custom_domain_label"] ||
        "Share custom domain",
      description:
        translations["builder.share.custom_domain_desc"] ||
        "Use your connected personal domain if you have one.",
      url: primaryCustomDomain ? `https://${primaryCustomDomain}` : null,
      shareText: site.title
        ? `Visit our wedding website: ${site.title}`
        : "Visit our wedding website.",
    },
    {
      id: "weddweb",
      label: translations["builder.share.weddweb_label"] || "Share WeddWeb",
      description:
        translations["builder.share.weddweb_desc"] ||
        "Share the main platform directly with another couple.",
      url: "https://www.weddweb.com",
      shareText:
        translations["builder.share.weddweb_text"] ||
        "Create and share your own wedding website with WeddWeb.",
    },
  ];

  const refetchDomains = async () => {
    setDomainLoading(true);
    try {
      await refresh();
    } finally {
      setDomainLoading(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await copyToClipboard(url);
      notify.success(translations["builder.domain.copied"] || "Link copied!");
    } catch {
      notify.error(
        translations["builder.domain.error_generic"] ||
          "Could not copy the link.",
      );
    }
  };

  const handleNativeShare = async (target: ShareTarget) => {
    if (!target.url) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: site.title || "WeddWeb",
          text: target.shareText,
          url: target.url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    }

    await handleCopyLink(target.url);
  };

  return (
    <>
      <div>
        {/* Conditional Subtitle based on Plan */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-md text-gray-600 sm:max-w-2xl">
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

          <BuilderButton
            size="sm"
            className="self-start whitespace-nowrap"
            onClick={() => setShareModalOpen(true)}
          >
            {translations["builder.share.cta"] || "Share"}
          </BuilderButton>
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

      <MainModal
        open={shareModalOpen}
        title={translations["builder.share.modal_title"] || "Share your links"}
        onClose={() => setShareModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {translations["builder.share.modal_subtitle"] ||
              "Choose the link you want to send. Each option can be shared natively, copied, emailed, or posted on social media."}
          </p>

          {shareTargets.map((target) => (
            <ShareTargetCard
              key={target.id}
              target={target}
              translations={translations}
              onShare={handleNativeShare}
              onCopy={handleCopyLink}
            />
          ))}
        </div>
      </MainModal>
    </>
  );
}

function buildShareHref(
  kind: "email" | "whatsapp" | "facebook" | "x" | "linkedin",
  url: string,
  text: string,
) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (kind) {
    case "email":
      return `mailto:?subject=${encodeURIComponent("Wedding link")}&body=${encodedText}%0A%0A${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return url;
  }
}

function ShareTargetCard({
  target,
  translations,
  onShare,
  onCopy,
}: {
  target: ShareTarget;
  translations: Record<string, string>;
  onShare: (target: ShareTarget) => Promise<void>;
  onCopy: (url: string) => Promise<void>;
}) {
  const isAvailable = Boolean(target.url);
  const socialLinkClass =
    "inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:border-(--builder-color-primary) hover:text-(--builder-color-primary) transition-colors";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {target.label}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{target.description}</p>
        </div>

        {target.url ? (
          <a
            href={target.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-(--builder-color-primary) hover:underline"
          >
            {translations["builder.domain.visit_site"] || "Visit"}
          </a>
        ) : (
          <span className="text-xs text-gray-400">
            {translations["builder.share.unavailable"] || "Unavailable"}
          </span>
        )}
      </div>

      <div className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 break-all">
        {target.url ||
          translations["builder.share.no_custom_domain"] ||
          "No custom domain connected yet."}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <BuilderButton
          size="sm"
          onClick={() => void onShare(target)}
          disabled={!isAvailable}
        >
          {translations["builder.share.action_share"] || "Share"}
        </BuilderButton>
        <BuilderButton
          variant="secondary"
          size="sm"
          onClick={() => target.url && void onCopy(target.url)}
          disabled={!isAvailable}
        >
          {translations["builder.share.action_copy"] || "Copy link"}
        </BuilderButton>

        {target.url && (
          <>
            <a
              href={buildShareHref("email", target.url, target.shareText)}
              className={socialLinkClass}
            >
              {translations["builder.share.action_email"] || "Email"}
            </a>
            <a
              href={buildShareHref("whatsapp", target.url, target.shareText)}
              target="_blank"
              rel="noreferrer"
              className={socialLinkClass}
            >
              WhatsApp
            </a>
            <a
              href={buildShareHref("facebook", target.url, target.shareText)}
              target="_blank"
              rel="noreferrer"
              className={socialLinkClass}
            >
              Facebook
            </a>
            <a
              href={buildShareHref("x", target.url, target.shareText)}
              target="_blank"
              rel="noreferrer"
              className={socialLinkClass}
            >
              X
            </a>
            <a
              href={buildShareHref("linkedin", target.url, target.shareText)}
              target="_blank"
              rel="noreferrer"
              className={socialLinkClass}
            >
              LinkedIn
            </a>
          </>
        )}
      </div>
    </div>
  );
}
