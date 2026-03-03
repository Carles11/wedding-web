import { createClient } from "@/4-shared/lib/supabase/client";
import type { ProgramEvent } from "@/4-shared/types";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

/**
 * Fetches all program events for a site, with translations from site_translations.
 * All returned ProgramEvent fields `title`, `location`, `description` are JSON objects keyed by language.
 */
export async function fetchProgramEventsBySite(
  siteId: string,
  enabledLangs: SupportedLanguage[], // e.g. ["es", "ca", "en"]
): Promise<ProgramEvent[]> {
  if (!siteId) return [];
  const supabase = await createClient();

  // Fetch events without i18n fields (those are now only in site_translations)
  const { data: events, error: eventsErr } = await supabase
    .from("program_events")
    .select(
      `id, site_id, day_tag, date, time, location_url, sort_order, created_at, is_main_event`,
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

  // Generate all possible translation keys for these events
  const allKeys: string[] = [];
  for (const ev of events) {
    for (const field of ["title", "location", "description"] as const) {
      allKeys.push(`program.event.${field}.${ev.id}`);
    }
  }

  // Fetch all translations for needed keys and langs
  const { data: translations, error: trErr } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", siteId)
    .in("locale", enabledLangs)
    .in("key", allKeys);

  if (trErr) {
    console.error("[fetchProgramEventsBySite] Translation error:", trErr);
  }

  // Build a convenient lookup map: { [key]: { [locale]: value } }
  const trMap: Record<string, Partial<Record<SupportedLanguage, string>>> = {};
  (translations ?? []).forEach((tr) => {
    if (!trMap[tr.key]) trMap[tr.key] = {};
    trMap[tr.key][tr.locale as SupportedLanguage] = tr.value;
  });

  // For each event, attach i18n objects from trMap (all enabled languages)
  const eventsWithTranslations: ProgramEvent[] = events.map((event) => {
    const filled: Record<
      "title" | "location" | "description",
      Record<SupportedLanguage, string>
    > = {
      title: {} as Record<SupportedLanguage, string>,
      location: {} as Record<SupportedLanguage, string>,
      description: {} as Record<SupportedLanguage, string>,
    };

    (["title", "location", "description"] as const).forEach((field) => {
      enabledLangs.forEach((lang) => {
        const key = `program.event.${field}.${event.id}`;
        const value = trMap[key]?.[lang];
        if (value) filled[field][lang] = value;
      });
    });

    return {
      ...event,
      title: filled.title,
      location: filled.location,
      description: filled.description,
    };
  });

  return eventsWithTranslations;
}
