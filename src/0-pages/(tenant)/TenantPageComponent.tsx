import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { generateEventSchema } from "@/4-shared/lib/seo/generateEventSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";

import { fetchAccommodationEntriesForTenant } from "@/3-entities/accommodation/api/fetchAccommodationEntriesForTenant";
import { fetchImagesForTenantSite } from "@/3-entities/images/api/fetchImagesForTenantSite";
import { fetchProgramSectionDataForTenant } from "@/3-entities/program_events/api/fetchProgramDataForTenant";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { fetchWeddingGiftSectionDataForTenant } from "@/3-entities/wedding_gifts/api/fetchWeddingGiftSectionDataForTenant";
import { fetchWhatToSeeDataForTenant } from "@/3-entities/what_to_see/api/fetchWhatToSeeDataForTenant";

import AccommodationSection from "@/2-features/tenant/sections/ui/AccommodationSection";
import ContactSection from "@/2-features/tenant/sections/ui/ContactSection";
import DetailsSection from "@/2-features/tenant/sections/ui/DetailsSection";
import HeroSection from "@/2-features/tenant/sections/ui/HeroSection";
import ProgramSectionComponent from "@/2-features/tenant/sections/ui/ProgramSection";
import WeddingGiftSection from "@/2-features/tenant/sections/ui/WeddingGiftSection";
import WhatElseSection from "@/2-features/tenant/sections/ui/WhatElseSection";

import { LanguageToggle } from "@/2-features/tenant/language-toggle/ui/LanguageToggle";
import TopMenu from "@/2-features/tenant/top-menu/ui/TopMenu";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { ProgramSection } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { headers } from "next/headers";

// --- MAIN MULTILINGUAL TENANT PAGE COMPONENT ---
export default async function TenantPageComponent({
  params,
}: {
  params: { lang: string };
}) {
  console.log("[SSR] RENDER", { params });
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const siteId = site?.id ?? null;

  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : site?.default_lang
        ? [site.default_lang]
        : ["en"];

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

  // for hero-section
  const heroFromi18n = {
    title: translations[`hero.title.${siteId}`] ?? "",
    description: translations[`hero.description.${siteId}`] ?? "",
  };

  // Fetch all in parallel (optimized for SSR)
  const [images, programData, accommodations, whatelse, weddingGift, contact] =
    await Promise.all([
      fetchImagesForTenantSite(siteId),
      fetchProgramSectionDataForTenant(siteId),
      fetchAccommodationEntriesForTenant(siteId),
      fetchWhatToSeeDataForTenant(siteId),
      fetchWeddingGiftSectionDataForTenant(siteId),
      fetchContactSection(siteId),
    ]);

  const heroImage = images[0]?.url ?? "";
  const contactImage = images[1]?.url ?? "";

  const { mainEvent, events } = programData;

  // Build minimal object for the schema
  const programSectionForSEO: ProgramSection | null = mainEvent
    ? {
        id: mainEvent.id,
        site_id: mainEvent.site_id,
        type: "program",
        title: {
          [lang]: translations["program.event.main-title"] ?? "Main event",
        },
        content: {
          headline: {
            [lang]: translations["program.event.main-title"] ?? "Main event",
          },
          when: {
            [lang]: mainEvent.time
              ? `${mainEvent.date} ${mainEvent.time}`
              : (mainEvent.date ?? ""),
          },
          where: {
            wedding: {
              [lang]:
                translations[`program.event.location.${mainEvent.id}`] ?? "",
            },
          },
          description: {
            [lang]:
              translations[`program.event.description.${mainEvent.id}`] ?? "",
          },
        },
        sort_order: mainEvent.sort_order ?? 0,
        created_at: mainEvent.created_at ?? undefined,
      }
    : null;

  // Structured data for SEO
  const baseUrl = `https://${host}/${lang}`;
  const eventSchema = generateEventSchema({
    hero: heroFromi18n,
    program: programSectionForSEO,
    lang,
    baseUrl,
    backgroundImage: heroImage,
  });

  const normalizedEvents = events.map((ev) => ({
    ...ev,
    title: ev.title ?? undefined,
    location: ev.location ?? undefined,
    description: ev.description ?? undefined,
  }));

  return (
    <>
      {/* JSON-LD SEO */}
      <JsonLd data={eventSchema} />

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
        {heroFromi18n && (
          <HeroSection hero={heroFromi18n} backgroundImage={heroImage} />
        )}
      </div>

      <main className="flex flex-col gap-0">
        {/* Program Main */}
        <ProgramSectionComponent
          mainEvent={mainEvent}
          lang={lang}
          translations={translations}
        />
        {/* Details - Full timeline all events */}
        {normalizedEvents && (
          <DetailsSection
            events={normalizedEvents}
            translations={translations}
          />
        )}

        {/* Accommodation */}
        {accommodations && (
          <AccommodationSection
            hotels={accommodations}
            translations={translations}
          />
        )}

        {/* What else */}
        {whatelse && (
          <WhatElseSection
            items={whatelse}
            lang={lang}
            translations={translations}
          />
        )}

        {/* Wedding Gift */}
        {weddingGift && (
          <WeddingGiftSection data={weddingGift} translations={translations} />
        )}

        {/* Contact */}
        {contact && (
          <ContactSection
            data={contact}
            lang={lang}
            translations={translations}
            backgroundImage={contactImage}
          />
        )}
      </main>
    </>
  );
}
