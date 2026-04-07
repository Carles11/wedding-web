import { formatToISO8601 } from "@/4-shared/helpers/formatToISO8601";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { HeroSectionType, ProgramSection } from "@/4-shared/types";

/**
 * Generate Event schema (JSON-LD) for wedding sites
 * https://schema.org/Event
 */
export function generateEventSchema(params: {
  hero: HeroSectionType | null;
  program: ProgramSection | null;
  lang: string;
  baseUrl: string;
  backgroundImage?: string;
}) {
  const { hero, program, lang, baseUrl, backgroundImage } = params;

  if (!hero) return null;

  const eventName = hero.title || "Wedding";
  const description = hero.description || "";

  // Get the combined "date + time" string from our helper
  const rawDate = getTextForLang(program?.content?.when, lang, "en");
  const isoDate = formatToISO8601(rawDate);

  const locationName = getTextForLang(
    program?.content?.where?.wedding,
    lang,
    "en",
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: description,
    inLanguage: lang,
    organizer: {
      "@type": "Person",
      name: eventName,
    },
    // SUCCESS: Now using validated ISO 8601
    ...(isoDate && {
      startDate: isoDate,
    }),
    ...(locationName && {
      location: {
        "@type": "Place",
        name: locationName,
        address: {
          "@type": "PostalAddress",
          name: locationName,
        },
      },
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: baseUrl,
    ...(backgroundImage && {
      image: backgroundImage.startsWith("http")
        ? backgroundImage
        : `${baseUrl}${backgroundImage}`,
    }),
  };

  return schema;
}
