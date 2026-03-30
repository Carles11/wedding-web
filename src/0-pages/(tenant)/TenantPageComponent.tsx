import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { generateEventSchema } from "@/4-shared/lib/seo/generateEventSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";

import { fetchAccommodationEntriesForTenant } from "@/3-entities/accommodation/api/fetchAccommodationEntriesForTenant";
import { fetchImagesForTenantSite } from "@/3-entities/images/api/fetchImagesForTenantSite";
import { fetchProgramSectionDataForTenant } from "@/3-entities/program_events/api/fetchProgramDataForTenant";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { fetchWeddingGiftSectionDataForTenant } from "@/3-entities/wedding_gifts/api/fetchWeddingGiftSectionDataForTenant";
import { fetchWhatToSeeDataForTenant } from "@/3-entities/what_to_see/api/fetchWhatToSeeDataForTenant";

import TenantHeroShell from "@/1-widgets/tenant/page/ui/TenantHeroShell";
import TenantNotFoundState from "@/1-widgets/tenant/page/ui/TenantNotFoundState";
import TenantSectionsContent from "@/1-widgets/tenant/page/ui/TenantSectionsContent";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { ProgramSection } from "@/4-shared/types";
import { headers } from "next/headers";

// --- MAIN MULTILINGUAL TENANT PAGE COMPONENT ---
export default async function TenantPageComponent({
  params,
}: {
  params: { lang: string };
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  console.log("[TenantPageComponent] entry, host:", host);
  const site = await getSiteByDomain(host);
  const siteId = site?.id ?? null;
  const translations = await getMergedTranslations(siteId, lang, "en");
  if (!site) {
    console.error("Could not resolve tenant for host:", host);
  }
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : site?.default_lang
        ? [site.default_lang]
        : ["en"];

  if (!siteId) {
    return <TenantNotFoundState host={host} translations={translations} />;
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

  const shouldRenderDetails = normalizedEvents.length > 0;
  const shouldRenderAccommodation = accommodations.length > 0;
  const shouldRenderWhatElse = whatelse.length > 0;
  const shouldRenderWeddingGift = Boolean(weddingGift);
  const shouldRenderContact = Boolean(contact);

  const visibleSectionIds = [
    shouldRenderDetails ? "details" : null,
    shouldRenderAccommodation ? "accommodation" : null,
    shouldRenderWhatElse ? "whatelse" : null,
    shouldRenderWeddingGift ? "gifts" : null,
    shouldRenderContact ? "contact" : null,
  ].filter((id): id is string => Boolean(id));

  return (
    <>
      {/* JSON-LD SEO */}
      <JsonLd data={eventSchema} />

      <TenantHeroShell
        lang={lang}
        translations={translations}
        visibleSectionIds={visibleSectionIds}
        availableLangs={availableLangs}
        hero={heroFromi18n}
        heroImage={heroImage}
      />

      <TenantSectionsContent
        mainEvent={mainEvent}
        lang={lang}
        translations={translations}
        normalizedEvents={normalizedEvents}
        accommodations={accommodations}
        whatelse={whatelse}
        weddingGift={weddingGift}
        contact={contact}
        contactImage={contactImage}
        shouldRenderDetails={shouldRenderDetails}
        shouldRenderAccommodation={shouldRenderAccommodation}
        shouldRenderWhatElse={shouldRenderWhatElse}
        shouldRenderWeddingGift={shouldRenderWeddingGift}
        shouldRenderContact={shouldRenderContact}
      />
    </>
  );
}
