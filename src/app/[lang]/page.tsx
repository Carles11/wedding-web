import { headers } from "next/headers";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { fetchHeroSection } from "@/3-entities/sections/api/fetchHeroSection";
import { fetchProgramSection } from "@/3-entities/sections/api/fetchProgramSection";
import { fetchDetailsSection } from "@/3-entities/sections/api/fetchDetailsSection";
import { fetchAccommodationSection } from "@/3-entities/sections/api/fetchAccommodationSection";
import { fetchWhatElseSection } from "@/3-entities/sections/api/fetchWhatElseSection";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";

import HeroSection from "@/3-entities/sections/ui/HeroSection";
import ProgramSectionComponent from "@/3-entities/sections/ui/ProgramSection";
import DetailsSection from "@/3-entities/sections/ui/DetailsSection";
import AccommodationSection from "@/3-entities/sections/ui/AccommodationSection";
import WhatElseSection from "@/3-entities/sections/ui/WhatElseSection";
import ContactSection from "@/3-entities/sections/ui/ContactSection";

import Heading from "@/4-shared/ui/typography/Heading";
import { LanguageToggle } from "@/2-features/language-toggle/ui/LanguageToggle";
import TopMenu from "@/2-features/top-menu/ui/TopMenu";

import { getMergedTranslations } from "@/4-shared/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage(props: { params: { lang: string } }) {
  const realParams = "then" in props.params ? await props.params : props.params;
  const lang = realParams.lang ?? "ca";

  // Resolve host and site
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const siteId = site?.id ?? null;

  // available languages for this specific site
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : site?.default_lang
      ? [site.default_lang]
      : ["en"];

  // fetch translations early for localized fallback content
  const translations = await getMergedTranslations(siteId, lang, "en");

  if (!siteId) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Heading as="h1" className="text-3xl md:text-4xl mb-4 text-red-700">
          {translations["event_not_found_title"] ?? "Wedding Event Not Found"}
        </Heading>
        <p className="text-lg text-gray-600 max-w-lg text-center">
          {translations["event_not_found_body"] ??
            "This wedding website is not yet published or available for this domain:"}{" "}
          <strong>{host}</strong>
        </p>
      </div>
    );
  }

  // SSR fetch hero/program and the new sections in parallel, scoped by site
  const [hero, program, details, accommodation, whatelse, contact] =
    await Promise.all([
      fetchHeroSection(siteId),
      fetchProgramSection(siteId),
      fetchDetailsSection(siteId),
      fetchAccommodationSection(siteId),
      fetchWhatElseSection(siteId),
      fetchContactSection(siteId),
    ]);

  return (
    <>
      <div className="relative">
        {/* Top-left: menu */}
        <div className="absolute top-3 left-3 z-50 pointer-events-auto">
          <div className="backdrop-blur-sm rounded-md p-1 shadow-sm">
            <TopMenu lang={lang} translations={translations} />
          </div>
        </div>

        {/* Top-right: language toggle */}
        <header
          aria-label="Page controls"
          className="absolute top-3 right-3 z-50 pointer-events-auto"
        >
          <div className="backdrop-blur-sm rounded-md p-1 shadow-sm">
            <LanguageToggle activeLang={lang} availableLangs={availableLangs} />
          </div>
        </header>

        {/* Hero */}
        {hero && (
          <HeroSection hero={hero} lang={lang} translations={translations} />
        )}
      </div>

      <main className="flex flex-col gap-16 md:gap-0">
        {/* Program */}
        {program && (
          <ProgramSectionComponent
            program={program}
            lang={lang}
            translations={translations}
          />
        )}

        {/* Details / Program timeline */}
        <DetailsSection
          data={details}
          lang={lang}
          translations={translations}
        />

        {/* Accommodation */}
        <AccommodationSection
          data={accommodation}
          lang={lang}
          translations={translations}
        />

        {/* What else to see & do */}
        <WhatElseSection
          data={whatelse}
          lang={lang}
          translations={translations}
        />

        {/* Contact */}
        <ContactSection
          data={contact}
          lang={lang}
          translations={translations}
        />
      </main>
    </>
  );
}
