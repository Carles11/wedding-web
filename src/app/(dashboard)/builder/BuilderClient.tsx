"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { useSite } from "@/4-shared/hooks/useSite";
import LanguageSelector from "@/4-shared/ui/LanguageSelector";
import { getCurrentUserSubscription } from "@/4-shared/api/builder/getCurrentUserSubscription";

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

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
}

function isGeneralComplete(site?: Site | null): boolean {
  return !!site?.title && !!site?.subdomain;
}
function isImagesComplete(site?: Site | null): boolean {
  return false;
}
function isProgramComplete(site?: Site | null): boolean {
  return false;
}
function isAccommodationComplete(site?: Site | null): boolean {
  return false;
}
function isWhatToSeeComplete(site?: Site | null): boolean {
  return false;
}
function isContactComplete(site?: Site | null): boolean {
  return false;
}
function isDomainBillingComplete(site?: Site | null): boolean {
  return true;
}

const STEP_COMPLETENESS: ((site?: Site | null) => boolean)[] = [
  isGeneralComplete,
  isImagesComplete,
  isProgramComplete,
  isAccommodationComplete,
  isWhatToSeeComplete,
  isContactComplete,
  isDomainBillingComplete,
];

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

  // NEW: Plan type and language limit
  const [planType, setPlanType] = useState<"free" | "monthly" | "yearly">(
    "free",
  );
  const langLimit = planType === "free" ? 1 : 11;

  useEffect(() => {
    if (user) {
      getCurrentUserSubscription(user.id)
        .then(setPlanType)
        .catch(() => setPlanType("free"));
    }
  }, [user]);

  // Language toggle handler: updates the lang param & stays on this page
  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Selector in top-right */}
      <div className="fixed top-4 right-4 z-50 bg-white/80 shadow-lg rounded-lg">
        <LanguageSelector
          currentLang={currentLang}
          label={translations["marketing.lang_selector.label"] ?? "Language"}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <header className="border-b bg-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">
            {translations["builder.header.title"]}
          </h1>
          <p className="text-sm text-gray-600">
            {translations["builder.header.subtitle"]}
          </p>
        </div>
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
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto bg-white shadow rounded flex">
          <nav className="w-64 border-r p-4">
            <h3 className="font-medium">
              {translations["builder.nav.steps_title"]}
            </h3>
            <ul className="mt-4 space-y-2">
              {STEP_KEYS.map((k, i) => {
                const isComplete = STEP_COMPLETENESS[i](site);
                return (
                  <li key={k}>
                    <button
                      className={`w-full text-left flex items-center px-3 py-2 rounded ${i === active ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
                      onClick={() => setActive(i)}
                    >
                      {/* Status icon before label */}
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

          <section className="flex-1 p-6">
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
                {active === 0 && (
                  <GeneralSiteForm
                    site={site ?? null}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    langLimit={langLimit} // <--- NEW: Pass limit
                    planType={planType} // <--- optionally pass for CTA
                  />
                )}
                {active === 1 && (
                  <ImagesBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 2 && (
                  <ProgramEventsBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 3 && (
                  <AccommodationBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 4 && (
                  <WhatToSeeBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                  />
                )}
                {active === 5 && (
                  <ContactBuilderStep
                    site={site ?? null}
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
                <button className="px-4 py-2 bg-green-600 text-white rounded">
                  {translations["builder.actions.save"]}
                </button>
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
