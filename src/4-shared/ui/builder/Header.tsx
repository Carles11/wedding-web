import { LogoutButton } from "@/2-features/auth/ui";
import { notify } from "@/4-shared/lib/toast/toast";
import type { Site } from "@/4-shared/types";
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
  const requiredSteps = stepStatus?.filter((s, i) => s !== "optional") ?? [];
  const allRequiredDone = requiredSteps.every((s) => s === "done");

  return (
    <header className="border-b bg-white p-4 sm:p-6">
      <div className="max-w-[95vw] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Branding/Title Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl text-(--builder-color-primary) font-bold leading-tight">
            {translations["builder.header.title"] || "Wedding-Web — Builder"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {translations["builder.header.subtitle"] ||
              "Manage the content of your website"}
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-end gap-4 w-full">
            {site?.subdomain ? (
              (() => {
                let previewUrl = "";
                if (typeof window !== "undefined") {
                  const { hostname } = window.location;
                  if (hostname === "localhost") {
                    previewUrl = `http://${site.subdomain}.localhost:3000`;
                  } else if (hostname.includes("vercel.app")) {
                    // Use the current host as the base, replacing the first part with the subdomain
                    // e.g. subdomain.weddwebcom-git-beta-deploy-carles-projects-5a7d39cc.vercel.app
                    const hostParts = hostname.split(".");
                    hostParts[0] = site.subdomain;
                    previewUrl = `${window.location.protocol}//${hostParts.join(".")}`;
                  } else {
                    previewUrl = `https://${site.subdomain}.weddweb.com`;
                  }
                }
                return (
                  <a
                    className="text-sm font-medium text-(--builder-color-primary) hover:underline whitespace-nowrap"
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!allRequiredDone) {
                        e.preventDefault();
                        notify.error(
                          "Please complete all required steps before previewing your site.",
                        );
                      }
                    }}
                    tabIndex={allRequiredDone ? 0 : -1}
                    aria-disabled={!allRequiredDone}
                  >
                    {translations["builder.header.site_preview"] ||
                      "Open site preview"}
                  </a>
                );
              })()
            ) : (
              <span className="text-sm text-gray-400">
                {translations["builder.header.no_site_yet"]}
              </span>
            )}
            <LogoutButton />
          </div>

          {/* Language Selector Container */}
          <div className="w-full sm:w-64">
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
    </header>
  );
}
