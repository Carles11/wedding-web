"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { useSite } from "@/4-shared/hooks/useSite";
import LanguageSelector from "@/4-shared/ui/LanguageSelector";
import { getCurrentUserSubscription } from "@/4-shared/api/builder/getCurrentUserSubscription";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import GeneralSiteForm from "@/1-widgets/builder/ui/GeneralSiteForm";
import ImagesBuilderStep from "@/1-widgets/builder/ui/ImagesBuilderStep";
import ProgramEventsBuilderStep from "@/1-widgets/builder/ui/ProgramEventsBuilderStep";
import AccommodationBuilderStep from "@/1-widgets/builder/ui/AccommodationBuilderStep";
import ContactBuilderStep from "@/1-widgets/builder/ui/ContactBuilderStep";
import WhatToSeeBuilderStep from "@/1-widgets/builder/ui/WhatToSeeBuilderStep";
import LogoutButton from "@/2-features/auth/ui/LogoutButton";
import type { Site } from "@/4-shared/types";
import {
  GreenCheckIcon,
  RedDotIcon,
} from "@/4-shared/ui/icons/completenessIcons";
import { FREE_LANGUAGES_LIMIT } from "@/4-shared/config/limits/usage-limits";

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
}

// Step completeness logic/helpers
function isGeneralComplete(site?: Site | null): boolean {
  return !!site?.title && !!site?.subdomain;
}
function isProgramComplete(site?: Site | null): boolean {
  // TODO: Implement real program completeness logic
  return false;
}
function isAccommodationComplete(site?: Site | null): boolean {
  // TODO: Implement real accommodations completeness logic
  return false;
}
function isWhatToSeeComplete(site?: Site | null): boolean {
  // TODO: Implement real what-to-see completeness logic
  return false;
}
function isContactComplete(site?: Site | null): boolean {
  // TODO: Implement real contact completeness logic
  return false;
}
function isDomainBillingComplete(site?: Site | null): boolean {
  // Assume always true if not billing/connecting domain
  return true;
}

const STEP_KEYS = [
  "builder.nav.step.general",
  "builder.nav.step.images",
  "builder.nav.step.program",
  "builder.nav.step.accommodation",
  "builder.nav.step.what_to_see",
  "builder.nav.step.contact",
  "builder.nav.step.domain_billing",
];

export default function BuilderClient({
  initialLang = "en",
  translations,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useSupabaseAuth();
  const {
    site,
    loading: siteLoading,
    error: siteError,
    refresh,
  } = useSite(user ?? null);

  const [active, setActive] = useState(0);
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [planType, setPlanType] = useState<
    "free" | "monthly" | "yearly" | null
  >(null);
  const [heroImageExists, setHeroImageExists] = useState(false);

  const langLimit =
    planType === "free" ? FREE_LANGUAGES_LIMIT : SUPPORTED_LANGUAGES.length;

  // Provision the site if it doesn't exist
  const provisionSite = useCallback(async () => {
    if (!user) return;
    try {
      await fetch("/api/provision-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, email: user.email }),
      });
      refresh();
    } catch (err) {
      console.error("Failed to provision site:", err);
    }
  }, [user, refresh]);

  useEffect(() => {
    if (user && !site && !siteLoading) {
      provisionSite();
    }
    // Only run when site not found after user is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, site, siteLoading]);

  useEffect(() => {
    if (user) {
      getCurrentUserSubscription(user.id)
        .then((type) => setPlanType(type))
        .catch(() => setPlanType("free"));
    }
  }, [user]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  // STEP_COMPLETENESS is now defined inside the functional component
  const STEP_COMPLETENESS: ((site?: Site | null) => boolean)[] = [
    isGeneralComplete,
    () => heroImageExists, // Correctly closes over latest state!
    isProgramComplete,
    isAccommodationComplete,
    isWhatToSeeComplete,
    isContactComplete,
    isDomainBillingComplete,
  ];

  if (!site || !planType) return <div>Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-100">
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
              label={
                translations["marketing.lang_selector.label"] ?? "Language"
              }
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 overflow-x-hidden">
        <div className="md:max-w-[95vw] mx-auto bg-white shadow rounded flex flex-col lg:flex-row">
          <div className="lg:flex">
            {/* ✅ MOBILE STEP SCROLLER */}
            <div className="lg:hidden border-b bg-white">
              <div className="flex overflow-x-auto gap-2 p-3">
                {STEP_KEYS.map((k, i) => {
                  const isComplete = STEP_COMPLETENESS[i](site);
                  return (
                    <button
                      key={k}
                      onClick={() => setActive(i)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded whitespace-nowrap border ${
                        i === active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {isComplete ? <GreenCheckIcon /> : <RedDotIcon />}
                      <span className="text-sm">{translations[k]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* ✅ DESKTOP SIDEBAR */}
            <nav className="hidden lg:block w-64 border-r p-4">
              <h3 className="font-semibold text-gray-700 text-2xl">
                {translations["builder.nav.steps_title"]}
              </h3>
              <ul className="mt-4 flex md:block gap-2 md:gap-0 space-y-0 md:space-y-2 min-w-max md:min-w-0">
                {STEP_KEYS.map((k, i) => {
                  const isComplete = STEP_COMPLETENESS[i](site);
                  return (
                    <li key={k}>
                      <button
                        className={`flex items-center px-3 py-2 rounded whitespace-nowrap md:w-full md:text-left ${
                          i === active
                            ? "bg-blue-50 font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setActive(i)}
                      >
                        <span className="w-6 flex justify-center items-center">
                          {isComplete ? <GreenCheckIcon /> : <RedDotIcon />}
                        </span>
                        {translations[k]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* ✅ CONTENT */}
          <section className="flex-1 min-w-0 p-4 sm:p-6">
            <h2 className="text-xl font-semibold">
              {translations[STEP_KEYS[active]]}
            </h2>
            <div className="mt-4">
              {siteLoading ? (
                <p>{translations["builder.status.loading"]}</p>
              ) : siteError ? (
                <p className="text-red-600">
                  {translations["builder.status.error"]} {siteError}
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    {translations["builder.status.site_id"]}{" "}
                    {site?.id ?? translations["builder.status.site_id_empty"]}
                  </p>
                  <p className="text-sm text-gray-600">
                    {translations["builder.status.subdomain"]}{" "}
                    {site?.subdomain ??
                      translations["builder.status.subdomain_empty"]}
                  </p>
                </>
              )}

              <div className="mt-8 border rounded p-4 bg-gray-50">
                {active === 0 && site && (
                  <GeneralSiteForm
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    langLimit={langLimit}
                    planType={planType}
                  />
                )}
                {active === 1 && site && (
                  <ImagesBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    setHeroImageExists={setHeroImageExists}
                  />
                )}
                {active === 2 && site && (
                  <ProgramEventsBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 3 && site && (
                  <AccommodationBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 4 && site && (
                  <WhatToSeeBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 5 && site && (
                  <ContactBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 6 && (
                  <div>
                    <p className="text-gray-700">
                      {translations["builder.step.domain_billing_desc"]}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="px-4 py-2 border rounded bg-white">
                  {translations["builder.actions.preview"]}
                </button>
                <button
                  className="px-3 py-2 text-sm text-gray-600"
                  onClick={() =>
                    alert(translations["builder.actions.discard_alert"])
                  }
                >
                  {translations["builder.actions.discard"]}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
