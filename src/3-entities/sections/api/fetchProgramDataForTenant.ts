import { SupportedLanguage } from "@/4-shared/config/i18n";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { ProgramEvent, ProgramSection } from "@/4-shared/types";

export async function fetchProgramDataForTenant(
  siteId: string,
  lang: SupportedLanguage,
): Promise<ProgramSection | null> {
  const supabase = await createSupabaseSSRClient();

  // 1. Site languages
  const { data: site } = await supabase
    .from("sites")
    .select("languages, default_lang")
    .eq("id", siteId)
    .maybeSingle();
  if (!site) return null;

  // 2. Section metadata (headline, etc)
  const { data: section } = await supabase
    .from("sections")
    .select("id, site_id, content, sort_order, created_at")
    .eq("site_id", siteId)
    .eq("type", "program")
    .maybeSingle();

  // 3. All program events
  const { data: events } = await supabase
    .from("program_events")
    .select(
      "id, site_id, day_tag, date, time, title, location, location_url, description, sort_order",
    )
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (!events) return null;

  const dayLabelKeys = [
    "program.day_before.label",
    "program.wedding_day.label",
    "program.day_after.label",
  ];

  const { data: labelTranslations } = await supabase
    .from("global_translations")
    .select("key, locale, value")
    .in("key", dayLabelKeys)
    .in("locale", [lang, site.default_lang ?? "en"]);

  function getLabel(key: string): string {
    // Try for requested lang, fallback to site.default_lang, finally any available
    return (
      labelTranslations?.find((t) => t.key === key && t.locale === lang)
        ?.value ||
      labelTranslations?.find(
        (t) => t.key === key && t.locale === site?.default_lang,
      )?.value ||
      ""
    );
  }

  // 4. Group events by day_tag
  const grouped = {
    day_before: [],
    wedding_day: [],
    day_after: [],
  } as Record<string, ProgramEvent[]>;

  for (const ev of events) {
    const k = ev.day_tag ?? "wedding_day";
    grouped[k].push(ev);
  }

  // 5. Compute "when" and "where": pick first event from main wedding day, or as needed
  const mainEvent =
    grouped["wedding_day"].length > 0 ? grouped["wedding_day"][0] : events[0];
  const when = mainEvent?.date
    ? { [lang]: mainEvent.date + (mainEvent.time ? ` ${mainEvent.time}` : "") }
    : {};
  const where = mainEvent?.location
    ? { wedding: mainEvent.location }
    : { wedding: {} };

  // 6. Headline: from section.content.headline or fallback
  const headline = section?.content?.headline?.[lang] ||
    section?.content?.headline?.[site.default_lang] || { [lang]: "" };

  // 7. Map days for UI
  const days = [
    {
      slug: "day_before",
      label: getLabel("program.day_before.label"),
      events: grouped.day_before,
    },
    {
      slug: "wedding_day",
      label: getLabel("program.wedding_day.label"),
      events: grouped.wedding_day,
    },
    {
      slug: "day_after",
      label: getLabel("program.day_after.label"),
      events: grouped.day_after,
    },
  ];
  return {
    id: section?.id ?? "program-section",
    site_id: siteId,
    type: "program",
    title: headline, // for now, pass headline as title
    content: {
      headline,
      when,
      where,
      days, // This is where ALL event data is!
    },
    sort_order: section?.sort_order ?? 0,
    created_at: section?.created_at ?? undefined,
  };
}
