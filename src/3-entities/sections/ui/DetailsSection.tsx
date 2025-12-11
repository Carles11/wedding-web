import React from "react";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

interface Event {
  time: string;
  title: string | Record<string, string>;
  location: string | Record<string, string>;
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
      ""
    ) ||
    getTextForLang(
      data?.content?.headline as Record<string, string> | undefined,
      lang,
      ""
    ) ||
    translations?.["menu.details"] ||
    "Details";

  const days: Day[] = data?.content?.days ?? [];

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
              <h3 className="text-lg font-semibold text-neutral-800">
                {getTextForLang(
                  day.label as Record<string, string> | undefined,
                  lang,
                  ""
                )}
              </h3>
            </div>

            <ul className="space-y-3">
              {Array.isArray(day.events) &&
                day.events.map((ev: Event, idx: number) => (
                  <li
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                  >
                    <div className="w-28 text-sm font-mono text-neutral-600">
                      {ev.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800">
                        {getTextForLang(
                          ev.title as Record<string, string> | undefined,
                          lang,
                          ""
                        )}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {getTextForLang(
                          ev.location as Record<string, string> | undefined,
                          lang,
                          ""
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
