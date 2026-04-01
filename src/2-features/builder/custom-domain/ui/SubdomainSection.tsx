import { getSiteUrl } from "@/4-shared/helpers/domains/getSiteUrl";
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
}

export const SubdomainSection: React.FC<Props> = ({
  site,
  domainSuffix,
  translations,
  copied,
  canEdit,
  onCopy,
  onEdit,
}) => {
  const activeUrl = getSiteUrl(site.subdomain ?? "");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-1   text-sm">
        <span className="text-gray-400 select-none">
          {activeUrl.startsWith("https") ? "https://" : "http://"}
        </span>
        <span className="font-bold text-gray-800">{site.subdomain}</span>
        <span className="text-gray-400 select-none">.{domainSuffix}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 md:gap-1">
          <button
            onClick={onCopy}
            className="p-1.5 text-gray-400 hover:text-[#6ABDA6] transition-colors cursor-pointer"
            title={translations["builder.domain.copy_url"]}
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-500"
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
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#6ABDA6] hover:underline flex items-center gap-1 transition-all"
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
            className="text-sm font-medium px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            {translations["builder.general.edit"] || "Change"}
          </button>
        )}
      </div>
    </div>
  );
};
