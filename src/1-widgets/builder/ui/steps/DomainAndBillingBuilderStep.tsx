"use client";

import MembershipSection from "@/2-features/builder/billing/ui/MembershipSection";
import CustomDomainSection from "@/2-features/builder/custom-domain/components/CustomDomainSection";
import SubdomainManager from "@/2-features/builder/custom-domain/components/SubdomainManager";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  DomainAndBillingBuilderStepProps,
  ShareTarget,
} from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { ShareTargetCard } from "@/4-shared/ui/commons/share/shareTargetCard";
import { copyToClipboard } from "@/4-shared/utils/copyToClipboard";
import { ShareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DomainAndBillingBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
}: DomainAndBillingBuilderStepProps) {
  const router = useRouter();

  const handleUpgradeClick = () => router.push(`/${lang || "en"}/pricing`);

  const verifiedDomains =
    site.domains?.filter(
      (d) => !d.endsWith(".weddweb.com") && !d.endsWith(".localhost:3000"),
    ) || [];

  const pendingDomains = site.pending_custom_domains || [];
  const domainStatuses = site.domain_statuses || {};

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
        ? translations["builder.share.subdomain_text_title"]?.replace(
            "{title}",
            site.title,
          ) || `Take a look at our wedding site on WeddWeb: ${site.title}`
        : translations["builder.share.subdomain_text"] ||
          "Take a look at our wedding site on WeddWeb.",
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
        ? translations["builder.share.custom_domain_text_title"]?.replace(
            "{title}",
            site.title,
          ) || `Visit our wedding website: ${site.title}`
        : translations["builder.share.custom_domain_text"] ||
          "Visit our wedding website.",
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
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    await handleCopyLink(target.url);
  };

  return (
    <>
      <div>
        {/* Subtitle + Share CTA */}
        <div className="mb-6">
          {/* Subtitle */}
          <p className="text-md text-gray-600 sm:max-w-2xl">
            {planType === "premium"
              ? translations["builder.step.domain_billing_subtitle_premium"] ||
                "Manage your professional web address and billing details below."
              : translations["builder.step.domain_billing_subtitle"] ||
                "Set up the web address of your event site. You can upgrade to unlock custom domains and access billing options."}
          </p>

          {/* Share button:
              - Mobile: full-width primary button with share icon, sits below subtitle with clear top margin
              - Desktop: inline secondary link-style, right-aligned next to subtitle
          */}

          {/* Desktop: right-aligned secondary button, same row as subtitle */}
          <div className="sm:flex sm:justify-end sm:mt-0 mt-4">
            <BuilderButton
              variant="primary"
              size="md"
              className="whitespace-nowrap w-full md:w-fit flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-80"
              onClick={() => setShareModalOpen(true)}
              icon={<ShareIcon size={16} />}
            >
              {translations["builder.share.cta"] || "Share with guests"}
            </BuilderButton>
          </div>
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
