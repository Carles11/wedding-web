import { LogoutButton } from "@/2-features/auth/ui";
import { getSiteUrl } from "@/4-shared/helpers/domains/getSiteUrl";
import { notify } from "@/4-shared/lib/toast/toast";
import type { Site } from "@/4-shared/types";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";

export function BuilderHeader({
  translations,
  site,
  currentLang = "en",
  handleLanguageChange = () => {},
  stepStatus = [],
}: {
  translations: Record<string, string>;
  site: Site | null;
  currentLang?: string;
  handleLanguageChange?: (lang: string) => void;
  stepStatus?: string[];
}) {
  const requiredSteps = stepStatus?.filter((s) => s !== "optional") ?? [];
  const allRequiredDone = requiredSteps.every((s) => s === "done");

  const [mobileLangOpen, setMobileLangOpen] = useState(false);

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
        language: currentLang,
      });
    }
  };

  const getPreviewUrl = getSiteUrl(site?.subdomain ?? "");

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!allRequiredDone) {
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
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* ── MOBILE HEADER (< sm) ────────────────────────────────────── */}
      <div className="flex sm:hidden items-center gap-2 px-4 py-2.5 min-w-0">
        {/* Title — pushes icons to the right, never wraps */}
        <h2 className="text-base font-semibold leading-none whitespace-nowrap flex-1 min-w-0 truncate">
          {translations["builder.header.title.short"] || "WeddWeb"}
        </h2>

        {/* Preview pill — only shown when subdomain exists */}
        {site?.subdomain && (
          <a
            href={getPreviewUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handlePreviewClick}
            tabIndex={allRequiredDone ? 0 : -1}
            aria-disabled={!allRequiredDone}
            className={[
              "text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 transition-opacity",
              allRequiredDone
                ? "text-(--builder-color-primary) border-(--builder-color-primary) hover:opacity-70"
                      : "text-gray-300 border-gray-200 dark:text-gray-600 dark:border-gray-700",
            ].join(" ")}
          >
            {translations["builder.header.preview_short"] || "Preview ↗"}
          </a>
        )}

        {/* Globe button — toggles language selector in the row below */}
        <button
          type="button"
          onClick={() => setMobileLangOpen((v) => !v)}
          aria-label={
            translations["marketing.lang_selector.label"] ?? "Language"
          }
          aria-expanded={mobileLangOpen}
          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[15px] h-[15px]"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>

        {/* Logout icon only */}
        <LogoutButton currentLang={currentLang} iconOnly />
      </div>

      {/* Language selector — slides open below the compact bar on mobile */}
      {mobileLangOpen && (
        <div className="sm:hidden px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <LanguageSelector
            currentLang={currentLang}
            label={translations["marketing.lang_selector.label"] ?? "Language"}
            onLanguageChange={(lang) => {
              handleLanguageChange(lang);
              setMobileLangOpen(false);
            }}
          />
        </div>
      )}

      {/* ── DESKTOP HEADER (≥ sm)  ──────── */}
      <div className="hidden sm:block p-4 sm:p-6">
        <div className="max-w-[95vw] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding/Title Section */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl text-(--builder-color-primary) font-bold leading-tight">
              {translations["builder.header.title"] ||
                "Wedding website — Builder"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {translations["builder.header.subtitle"] ||
                "Manage the content of your website"}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-end gap-4 w-full">
              {site?.subdomain ? (
                <a
                  className={[
                    "text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 transition-opacity",
                    allRequiredDone
                      ? "text-(--builder-color-primary) border-(--builder-color-primary) hover:opacity-70"
                : "text-gray-300 border-gray-200 dark:text-gray-600 dark:border-gray-700",
                  ].join(" ")}
                  href={getPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handlePreviewClick}
                  tabIndex={allRequiredDone ? 0 : -1}
                  aria-disabled={!allRequiredDone}
                >
                  {translations["builder.header.site_preview"] ||
                    "Open site preview"}
                </a>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {translations["builder.header.no_site_yet"]}
                </span>
              )}
              <LogoutButton currentLang={currentLang} />
            </div>

            {/* Language Selector */}
            <div className="w-fit">
              <LanguageSelector
                currentLang={currentLang}
                label={
                  translations["marketing.lang_selector.label"] ?? "Language"
                }
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
