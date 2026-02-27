import type { HeroSectionType, ProgramSection } from "@/4-shared/types";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";

/**
 * Generate Event schema (JSON-LD) for wedding sites
 * https://schema.org/Event
 */
export function generateEventSchema(params: {
  hero: HeroSectionType | null;
  program: ProgramSection | null;
  lang: string;
  baseUrl: string;
}) {
  const { hero, program, lang, baseUrl } = params;

  if (!hero) return null;

  // NEW: title and description are now simple strings!
  const eventName = hero.title || "Wedding";
  const description = hero.description || "";

  // The program may still be old format—keep getTextForLang for now, refactor when migrated
  const eventDate = getTextForLang(program?.content?.when, lang, "ca");
  const locationName = getTextForLang(
    program?.content?.where?.wedding,
    lang,
    "ca",
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: description,
    ...(eventDate && {
      startDate: eventDate, // TODO: Parse to ISO 8601 if needed
    }),
    ...(locationName && {
      location: {
        "@type": "Place",
        name: locationName,
      },
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: baseUrl,
    // NEW: Use hero.backgroundImage if present
    ...(hero.backgroundImage && {
      image: hero.backgroundImage,
    }),
  };

  return schema;
}
