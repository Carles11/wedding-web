import { createClient } from "@/4-shared/lib/supabase/client";
import type { ProgramEvent } from "@/4-shared/types";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

export async function fetchProgramEventsBySite(
  siteId: string,
  enabledLangs: SupportedLanguage[], // e.g. ["es", "ca", "en"]
): Promise<ProgramEvent[]> {
  if (!siteId) return [];
  const supabase = await createClient();

  // Fetch events
  const { data: events, error: eventsErr } = await supabase
    .from("program_events")
    .select(
      `id, site_id, day_tag, date, time, title, location, location_url, description, sort_order, created_at`,
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (eventsErr || !events || events.length === 0) {
    console.error(
      "[fetchProgramEventsBySite] Supabase error or no events:",
      eventsErr,
    );
    return [];
  }

  // Build query keys for all events
  const allKeys: string[] = [];
  for (const ev of events) {
    for (const field of ["title", "location", "description"] as const) {
      for (const lang of enabledLangs) {
        allKeys.push(`program.event.${field}.${ev.id}`);
      }
    }
  }

  // Fetch all translations for these keys & langs
  const { data: translations, error: trErr } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", siteId)
    .in("locale", enabledLangs)
    .in("key", allKeys);

  if (trErr) {
    console.error("[fetchProgramEventsBySite] Translation error:", trErr);
  }

  // For each event, override string fields as needed
  const eventsWithTranslations: ProgramEvent[] = events.map((event) => {
    // Fields: title, location, description (each is JSON object by lang)
    const newEvent = { ...event };

    for (const field of ["title", "location", "description"] as const) {
      const origObj = (event[field] ?? {}) as Record<SupportedLanguage, string>;
      const merged: Record<SupportedLanguage, string> = { ...origObj };

      for (const lang of enabledLangs) {
        const trValue = translations?.find(
          (t) =>
            t.key === `program.event.${field}.${event.id}` && t.locale === lang,
        )?.value;
        if (trValue !== undefined && trValue !== null) {
          merged[lang] = trValue;
        }
      }
      newEvent[field] = merged;
    }

    return newEvent;
  });

  return eventsWithTranslations;
}
