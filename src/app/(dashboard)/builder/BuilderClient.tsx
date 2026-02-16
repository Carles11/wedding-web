"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { useSite } from "@/4-shared/hooks/useSite";
import LanguageSelector from "@/4-shared/ui/LanguageSelector";

import GeneralSiteForm from "@/1-widgets/builder/ui/GeneralSiteForm";
import ImagesBuilderStep from "@/1-widgets/builder/ui/ImagesBuilderStep";
import ProgramEventsBuilderStep from "@/1-widgets/builder/ui/ProgramEventsBuilderStep";
import AccommodationBuilderStep from "@/1-widgets/builder/ui/AccommodationBuilderStep";
import ContactBuilderStep from "@/1-widgets/builder/ui/ContactBuilderStep";
import WhatToSeeBuilderStep from "@/1-widgets/builder/ui/WhatToSeeBuilderStep";
import LogoutButton from "@/2-features/auth/ui/LogoutButton";

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
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
              {STEP_KEYS.map((k, i) => (
                <li key={k}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${i === active ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
                    onClick={() => setActive(i)}
                  >
                    {translations[k]}
                  </button>
                </li>
              ))}
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
                  <GeneralSiteForm site={site ?? null} refresh={refresh} />
                )}
                {active === 1 && (
                  <ImagesBuilderStep site={site ?? null} refresh={refresh} />
                )}
                {active === 2 && (
                  <ProgramEventsBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                  />
                )}
                {active === 3 && (
                  <AccommodationBuilderStep
                    site={site ?? null}
                    refresh={refresh}
                  />
                )}
                {active === 4 && (
                  <WhatToSeeBuilderStep site={site ?? null} refresh={refresh} />
                )}
                {active === 5 && (
                  <ContactBuilderStep site={site ?? null} refresh={refresh} />
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
