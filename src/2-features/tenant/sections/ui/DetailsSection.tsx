import {
  formatCompactEventDate,
  formatEventDate,
} from "@/4-shared/helpers/formatEventDate";
import { formatEventTime } from "@/4-shared/helpers/formatEventTime";
import type { TranslationDictionary } from "@/4-shared/types";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";
import SectionContainer from "@/4-shared/ui/tenant/section/SectionContainer";

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
  lang: string;
  translations?: TranslationDictionary | null;
};

const DAY_GROUPS = [
  {
    slug: "day_before",
    labelKey: "program.day_before.label",
    defaultLabel: "Before Wedding Day",
  },
  {
    slug: "wedding_day",
    labelKey: "program.wedding_day.label",
    defaultLabel: "Wedding Day",
  },
  {
    slug: "day_after",
    labelKey: "program.day_after.label",
    defaultLabel: "After Wedding Day",
  },
];

export default function DetailsSection({
  events,
  lang,
  translations,
}: DetailsSectionProps) {
  // Group events by day_tag
  const grouped = DAY_GROUPS.map((group) => {
    const dayEvents = events.filter((ev) => ev.day_tag === group.slug);
    // Read from merged global+site translations
    const label = translations?.[group.labelKey] ?? group.defaultLabel;
    const displayDate =
      group.slug === "wedding_day"
        ? formatEventDate(
            dayEvents.find((ev) => !!ev.date)?.date ?? undefined,
            undefined,
            lang,
          )
        : "";
    return {
      slug: group.slug,
      label,
      displayDate,
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
      label: translations?.["program.other_days.label"] ?? "Other days",
      displayDate: "",
      events: unknownEvents,
    });
  }

  const underlineConfig = {
    initialHeightClass: "max-h-[2px]",
    expandedHeightClass: "group-hover:max-h-[10px] group-focus:max-h-[10px]",
    durationMs: 300,
  };

  const locationLinkLabel = translations?.["localize"] ?? "Find it";

  const headline =
    translations?.["menu.details"] ??
    translations?.["details.headline"] ??
    "Details";

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
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-semibold text-neutral-800">
                    {day.label}
                  </h3>
                  {day.displayDate && (
                    <div className="text-sm font-medium text-neutral-500 sm:text-right">
                      {day.displayDate}
                    </div>
                  )}
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

                    const compactDate =
                      day.slug !== "wedding_day"
                        ? formatCompactEventDate(ev.date, lang)
                        : "";

                    return (
                      <li
                        key={ev.id ?? idx}
                        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                      >
                        <div className="w-24 text-sm font-mono text-neutral-600">
                          <div>{ev.time ? formatEventTime(ev.time) : ""}</div>
                          {compactDate && (
                            <div className="mt-0.5 text-xs font-semibold text-neutral-500">
                              {compactDate}
                            </div>
                          )}
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
