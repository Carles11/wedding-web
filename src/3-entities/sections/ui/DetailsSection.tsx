import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/types";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";
import { formatEventTime } from "@/4-shared/helpers/formatEventTime";

type ProgramEvent = {
  id: string;
  day_tag?: string | null;
  date?: string | null;
  time?: string | null;
  title?: string | Record<string, string>;
  location?: string | Record<string, string>;
  location_url?: string | null;
};

type DetailsSectionProps = {
  events: ProgramEvent[];
  translations?: TranslationDictionary | null;
};

const DAY_GROUPS = [
  {
    slug: "day_before",
    labelKey: "program.day_before.label",
    defaultLabel: "El dia abans",
  },
  {
    slug: "wedding_day",
    labelKey: "program.wedding_day.label",
    defaultLabel: "El gran dia",
  },
  {
    slug: "day_after",
    labelKey: "program.day_after.label",
    defaultLabel: "L'endemà",
  },
];

export default function DetailsSection({
  events,
  translations,
}: DetailsSectionProps) {
  // Group events by day_tag
  const grouped = DAY_GROUPS.map((group) => {
    const dayEvents = events.filter((ev) => ev.day_tag === group.slug);
    // Read from merged global+site translations
    const label = translations?.[group.labelKey] ?? group.defaultLabel;
    return {
      slug: group.slug,
      label,
      events: dayEvents,
    };
  });

  // Find extra events with other/unknown tags
  const unknownEvents = events.filter(
    (ev) => !DAY_GROUPS.some((g) => g.slug === ev.day_tag),
  );
  if (unknownEvents.length > 0) {
    grouped.push({
      slug: "other",
      label: translations?.["program.other_days.label"] ?? "Altres dies",
      events: unknownEvents,
    });
  }

  const underlineConfig = {
    initialHeightClass: "max-h-[2px]",
    expandedHeightClass: "group-hover:max-h-[10px] group-focus:max-h-[10px]",
    durationMs: 300,
  };

  const locationLinkLabel = translations?.["localize"] ?? "Com arribar-hi";

  const headline =
    translations?.["menu.details"] ??
    translations?.["details.headline"] ??
    "Detalls";

  return (
    <SectionContainer
      id="details"
      heading={headline}
      headingId="details-heading"
      variant="white"
      withDivider
      dividerMotive="flower2"
      dividerClassName="w-32 h-auto"
      dividerSize={110}
      dividerOpacity={0.06}
    >
      <div className="space-y-6">
        {grouped.map(
          (day) =>
            day.events.length > 0 && (
              <div
                key={day.slug}
                className="bg-neutral-50 rounded-lg p-4 md:p-6 border border-neutral-100 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-neutral-800">
                    {day.label}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {day.events.map((ev, idx) => {
                    // NEW: Multi-lang translations via keys
                    const evTitle =
                      translations?.[`program.event.title.${ev.id}`] ?? "";
                    const evLocation =
                      translations?.[`program.event.location.${ev.id}`] ?? "";
                    const evDescription =
                      translations?.[`program.event.description.${ev.id}`] ??
                      "";

                    const locationAria = evLocation
                      ? `Open location for ${evLocation}`
                      : "Open location";

                    return (
                      <li
                        key={ev.id ?? idx}
                        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                      >
                        <div className="w-24 text-sm font-mono text-neutral-600">
                          {ev.time ? formatEventTime(ev.time) : ""}
                        </div>
                        <div className="flex-1">
                          {/* Title bold, location/desc regular, link (all optional) */}
                          {evTitle && (
                            <div className="font-semibold text-neutral-800">
                              {evTitle}
                            </div>
                          )}
                          {evLocation && (
                            <div className="text-sm text-neutral-600">
                              {evLocation}
                            </div>
                          )}
                          {evDescription && (
                            <div className="text-sm text-neutral-500">
                              {evDescription}
                            </div>
                          )}
                          {ev.location_url && ev.location_url.trim() !== "" && (
                            <div className="mt-2">
                              <UnderlinedLink
                                href={ev.location_url}
                                external
                                ariaLabel={locationAria}
                                thicknessClass="h-0.5"
                                {...underlineConfig}
                              >
                                {locationLinkLabel}
                              </UnderlinedLink>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
        )}
      </div>
    </SectionContainer>
  );
}
