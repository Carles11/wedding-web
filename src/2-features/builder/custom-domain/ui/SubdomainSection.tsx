import { getSiteUrl } from "@/4-shared/helpers/domains/getSiteUrl";
import { notify } from "@/4-shared/lib/toast/toast";
import type { Site } from "@/4-shared/types";
import React from "react";

interface Props {
  site: Site;
  domainSuffix: string;
  translations: Record<string, string>;
  copied: boolean;
  canEdit: boolean;
  onCopy: () => void;
  onEdit: () => void;
  allStepsComplete?: boolean;
}

export const SubdomainSection: React.FC<Props> = ({
  site,
  domainSuffix,
  translations,
  copied,
  canEdit,
  onCopy,
  onEdit,
  allStepsComplete = false,
}) => {
  const getPreviewUrl = getSiteUrl(site.subdomain ?? "");

  // --- Analytics Handler ---
  const trackSitePreview = (subdomain: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "site_preview_opened", {
        event_category: "engagement",
        event_label: subdomain,
        environment:
          window.location.hostname === "localhost"
            ? "development"
            : "production",
        language: site.default_lang || "en",
      });
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!allStepsComplete) {
      e.preventDefault();
      notify.error(
        translations["builder.header.error.incomplete"] ||
          "Please complete all required steps before previewing your site.",
      );
      return;
    }
    if (site?.subdomain) trackSitePreview(site.subdomain);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-1   text-sm">
        <span className="text-gray-400 dark:text-gray-500 select-none">
          {getPreviewUrl.startsWith("https") ? "https://" : "http://"}
        </span>
        <span className="font-bold text-gray-800 dark:text-gray-200">{site.subdomain}</span>
        <span className="text-gray-400 dark:text-gray-500 select-none">.{domainSuffix}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 md:gap-1">
          <button
            onClick={onCopy}
            title={translations["builder.domain.copy_url"]}
            className="text-sm font-medium px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
          <a
            href={getPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={allStepsComplete ? 0 : -1}
            aria-disabled={!allStepsComplete}
            className={[
              // Added 'inline-flex', 'items-center', and 'gap-1'
              "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 whitespace-nowrap shrink-0 transition-opacity",
              allStepsComplete
                ? "text-(--builder-color-primary) border-(--builder-color-primary-hover) hover:opacity-70"
                : "text-gray-300 dark:text-gray-500 border-gray-200 dark:border-gray-700",
            ].join(" ")}
            onClick={handlePreviewClick}
          >
            {translations["builder.domain.visit_site"] || "Visit"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {canEdit && (
          <button
            onClick={onEdit}
            className="text-sm font-medium px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
          >
            {translations["builder.general.edit"] || "Change"}
          </button>
        )}
      </div>
    </div>
  );
};
