import React from "react";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/types";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";

interface Event {
  time: string;
  title: string | Record<string, string>;
  location: string | Record<string, string>;
  location_url?: string | null;
}

interface Day {
  slug: string;
  label: string | Record<string, string>;
  events: Event[];
}

interface DetailsData {
  title?: string | Record<string, string>;
  content?: {
    headline?: string | Record<string, string>;
    days?: Day[];
  };
}

type DetailsSectionProps = {
  data: DetailsData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * DetailsSection: program timeline.
 * - Uses SectionContainer for consistent layout and the decorative divider.
 * - Anchor: id="details"
 */
export default function DetailsSection({
  data,
  lang,
  translations,
}: DetailsSectionProps) {
  const headline =
    getTextForLang(
      data?.title as Record<string, string> | undefined,
      lang,
      "",
    ) ||
    getTextForLang(
      data?.content?.headline as Record<string, string> | undefined,
      lang,
      "",
    ) ||
    translations?.["menu.details"] ||
    "Details";

  const days: Day[] = data?.content?.days ?? [];

  // Consistent underline configuration used across the site
  const underlineConfig = {
    initialHeightClass: "max-h-[2px]",
    expandedHeightClass: "group-hover:max-h-[10px] group-focus:max-h-[10px]",
    durationMs: 300,
  };

  const locationLinkLabel = translations?.["localize"] ?? "Localízalo";

  return (
    <SectionContainer
      id="details"
      heading={headline}
      headingId="details-heading"
      variant="white"
      withDivider
      dividerMotive="flower2"
      dividerClassName="w-32 h-auto" // optional: tune size via Tailwind
      dividerSize={110} // optional: exact pixel size for next/image
      dividerOpacity={0.06} // optional: pick opacity
    >
      <div className="space-y-6">
        {days.map((day) => (
          <div
            key={day.slug}
            className="bg-neutral-50 rounded-lg p-4 md:p-6 border border-neutral-100 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-neutral-800">
                {getTextForLang(
                  day.label as Record<string, string> | undefined,
                  lang,
                  "",
                )}
              </h3>
            </div>

            <ul className="space-y-3">
              {Array.isArray(day.events) &&
                day.events.map((ev: Event, idx: number) => {
                  const evTitle = getTextForLang(
                    ev.title as Record<string, string> | undefined,
                    lang,
                    "",
                  );
                  const evLocation = getTextForLang(
                    ev.location as Record<string, string> | undefined,
                    lang,
                    "",
                  );

                  // aria label for the link: include the localized place when possible
                  const locationAria = evLocation
                    ? `Open location for ${evLocation}`
                    : "Open location";

                  return (
                    <li
                      key={idx}
                      className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                    >
                      <div className="w-28 text-sm font-mono text-neutral-600">
                        {ev.time}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-800">
                          {evTitle}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {evLocation}
                        </div>

                        {/* Render the location_url immediately under the location (if present) */}
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
        ))}
      </div>
    </SectionContainer>
  );
}
