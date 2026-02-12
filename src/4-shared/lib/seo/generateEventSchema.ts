import type { HeroSection, ProgramSection } from "@/4-shared/types";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";

/**
 * Generate Event schema (JSON-LD) for wedding sites
 * https://schema.org/Event
 */
export function generateEventSchema(params: {
  hero: HeroSection | null;
  program: ProgramSection | null;
  lang: string;
  baseUrl: string;
}) {
  const { hero, program, lang, baseUrl } = params;

  if (!hero) return null;

  const eventName = getTextForLang(hero.title, lang, "ca") || "Wedding";
  const description =
    getTextForLang(hero.content?.description, lang, "ca") || "";
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
    ...(hero.content?.backgroundImage && {
      image: hero.content.backgroundImage,
    }),
  };

  return schema;
}
