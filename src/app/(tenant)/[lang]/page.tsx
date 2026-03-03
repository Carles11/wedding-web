import { JsonLd } from "@/4-shared/ui/seo/JsonLd";
import { generateEventSchema } from "@/4-shared/lib/seo/generateEventSchema";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { fetchDetailsSection } from "@/3-entities/sections/api/fetchDetailsSection";
import { fetchAccommodationSection } from "@/3-entities/sections/api/fetchAccommodationSection";
import { fetchWhatElseSection } from "@/3-entities/sections/api/fetchWhatElseSection";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { fetchBankDataSection } from "@/3-entities/sections/api/fetchBankDataSection";
import { fetchImagesForTenantSite } from "@/3-entities/images/api/fetchImagesForTenantSite";

import HeroSection from "@/3-entities/sections/ui/HeroSection";
import ProgramSectionComponent from "@/3-entities/sections/ui/ProgramSection";
import DetailsSection from "@/3-entities/sections/ui/DetailsSection";
import AccommodationSection from "@/3-entities/sections/ui/AccommodationSection";
import WhatElseSection from "@/3-entities/sections/ui/WhatElseSection";
import ContactSection from "@/3-entities/sections/ui/ContactSection";
import BankDataSection from "@/3-entities/sections/ui/BankDataSection";

import Heading from "@/4-shared/ui/typography/Heading";
import { LanguageToggle } from "@/2-features/language-toggle/ui/LanguageToggle";
import TopMenu from "@/2-features/top-menu/ui/TopMenu";

import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { fetchProgramSectionData } from "@/3-entities/sections/api/fetchProgramDataForTenant";
import { ProgramSection } from "@/4-shared/types";

export const dynamic = "force-dynamic";

/**
 * Generate SEO metadata for tenant wedding sites
 * - Dynamic title/description per site and language
 * - Open Graph tags for social sharing
 * - hreflang alternates for multilingual SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const siteId = site?.id ?? null;

  const translations = await getMergedTranslations(siteId, lang, "en");

  if (!site) {
    return {
      title: "Wedding Event Not Found",
      description: "This wedding website is not available.",
    };
  }

  const baseUrl = `https://${host}`;

  const heroFromi18n = {
    title: translations["sections.hero.title"] ?? "",
    description: translations["sections.hero.description"] ?? "",
  };

  // Get available languages from site
  const availableLangs =
    Array.isArray(site.languages) && site.languages.length > 0
      ? site.languages
      : [site.default_lang || "ca"];

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  availableLangs.forEach((l) => {
    languages[l] = `${baseUrl}/${l}`;
  });

  return {
    title: heroFromi18n.title,
    description: heroFromi18n.description,
    openGraph: {
      title: heroFromi18n.title,
      description: heroFromi18n.description,
      type: "website",
      locale: lang === "ca" ? "ca_ES" : lang === "es" ? "es_ES" : "en_US",
      url: `${baseUrl}/${lang}`,
      siteName: heroFromi18n.title,
    },
    twitter: {
      card: "summary_large_image",
      title: heroFromi18n.title,
      description: heroFromi18n.description,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const realParams = await props.params;
  const lang = realParams.lang ?? "ca";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();

  const site = await getSiteByDomain(host);
  const siteId = site?.id ?? null;

  // Fetch hero-images for background images in hero and contact sections
  const images = await fetchImagesForTenantSite(siteId);
  const heroImage = images[0]?.url ?? ""; // first image for hero section
  const contactImage = images[1]?.url ?? ""; // second image for contact section

  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : site?.default_lang
        ? [site.default_lang]
        : ["en"];

  const translations = await getMergedTranslations(siteId, lang, "en");

  // for hero-section we just need the title/description keys, so we can get them directly from i18n
  const heroFromi18n = {
    title: translations["sections.hero.title"] ?? "",
    description: translations["sections.hero.description"] ?? "",
  };

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

  // Fetch events (timeline) and mainEvent for Program/Details sections!
  const { mainEvent, events } = await fetchProgramSectionData(siteId);

  // Build a minimal compatible object for the schema
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

  // Fetch rest in parallel
  const [details, accommodation, whatelse, bankData, contact] =
    await Promise.all([
      fetchDetailsSection(siteId),
      fetchAccommodationSection(siteId),
      fetchWhatElseSection(siteId),
      fetchBankDataSection(siteId),
      fetchContactSection(siteId),
    ]);

  // Generate structured data for SEO
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
      {/* JSON-LD Structured Data */}
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
        <DetailsSection events={normalizedEvents} translations={translations} />

        {/* Accommodation */}
        <AccommodationSection
          data={accommodation}
          lang={lang}
          translations={translations}
        />

        {/* What else */}
        <WhatElseSection
          data={whatelse}
          lang={lang}
          translations={translations}
        />

        {/* Bank Data */}
        {bankData && (
          <BankDataSection
            data={bankData}
            lang={lang}
            translations={translations}
          />
        )}

        {/* Contact */}
        <ContactSection
          data={contact}
          lang={lang}
          translations={translations}
          backgroundImage={contactImage}
        />
      </main>
    </>
  );
}
