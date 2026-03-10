import { LogoutButton } from "@/2-features/auth/ui";
import type { Site } from "@/4-shared/types";
import LanguageSelector from "./LanguageSelector";

export function BuilderHeader({
  translations,
  site,
  currentLang = "en",
  handleLanguageChange = () => {},
}: {
  translations: Record<string, string>;

  site: Site | null;
  currentLang?: string;
  handleLanguageChange?: (lang: string) => void;
}) {
  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div>
        <h2 className="text-blue-600 font-semibold">
          {translations["builder.header.title"]}
        </h2>
        <p className="text-sm text-gray-600">
          {translations["builder.header.subtitle"]}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-end-safe gap-4">
        <div className="flex items-center gap-4">
          {site ? (
            <a
              className="text-sm text-blue-600"
              href={`https://${site.subdomain}.weddweb.com`}
              target="_blank"
              rel="noreferrer"
            >
              {translations["builder.header.site_preview"]}
            </a>
          ) : (
            <span className="text-sm text-gray-500">
              {translations["builder.header.no_site_yet"]}
            </span>
          )}
          <LogoutButton />
        </div>
        <div className=" top-4 right-4 z-50 bg-white/80 shadow-lg rounded-lg">
          <LanguageSelector
            currentLang={currentLang}
            label={translations["marketing.lang_selector.label"] ?? "Language"}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </header>
  );
}
