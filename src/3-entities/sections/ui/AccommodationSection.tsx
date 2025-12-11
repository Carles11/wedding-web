import React from "react";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type Hotel = {
  name?: string | Record<string, string>;
  address?: string | Record<string, string>;
  phone?: string;
  email?: string;
  website?: string;
};

type AccommodationData = {
  title?: string | Record<string, string>;
  content?: {
    headline?: string | Record<string, string>;
    hotels?: Hotel[];
  };
};

type AccommodationSectionProps = {
  data: AccommodationData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

function IconPhone() {
  return (
    <svg
      className="w-4 h-4 inline-block mr-2"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 1 .85l.4 3a1 1 0 0 1-.27.82l-1.2 1.2a16 16 0 0 0 6.6 6.6l1.2-1.2a1 1 0 0 1 .82-.27l3 .4a1 1 0 0 1 .85 1V19a2 2 0 0 1-2 2H19c-8.284 0-15-6.716-15-15V5z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconMail() {
  return (
    <svg
      className="w-4 h-4 inline-block mr-2"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8l-9 6-9-6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconLink() {
  return (
    <svg
      className="w-4 h-4 inline-block mr-2"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M10 14a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 0 0-4.24-4.24L10 9.76"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10a3 3 0 0 0-4.24 0L7.64 12.36a3 3 0 0 0 4.24 4.24L14 14.24"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * AccommodationSection: list of hotels with subtle card style.
 * - Anchor: id="accommodation"
 */
export default function AccommodationSection({
  data,
  lang,
  translations,
}: AccommodationSectionProps) {
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
    translations?.["menu.accommodation"] ||
    "Accommodation";

  const hotels: Hotel[] = data?.content?.hotels ?? [];

  return (
    <SectionContainer
      id="accommodation"
      heading={headline}
      headingId="accommodation-heading"
      variant="muted"
      withDivider
      dividerMotive="flower1"
      dividerClassName="w-36 h-auto"
      dividerSize={120}
      dividerOpacity={0.055}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((h: Hotel, i: number) => (
          <article
            key={i}
            className="relative p-4 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-200 to-indigo-100 opacity-60"
              aria-hidden
            />
            <div className="pl-3">
              <h3 className="font-semibold text-lg text-neutral-800">
                {getTextForLang(
                  h.name as Record<string, string> | undefined,
                  lang,
                  ""
                )}
              </h3>
              <address className="not-italic text-sm text-neutral-600 mt-1">
                {getTextForLang(
                  h.address as Record<string, string> | undefined,
                  lang,
                  ""
                )}
              </address>

              <div className="mt-3 text-sm space-y-1">
                {h.phone && (
                  <div>
                    <a
                      className="text-neutral-700 hover:underline inline-flex items-center"
                      href={`tel:${h.phone}`}
                    >
                      <IconPhone />
                      <span>{h.phone}</span>
                    </a>
                  </div>
                )}
                {h.email && (
                  <div>
                    <a
                      className="text-neutral-700 hover:underline inline-flex items-center"
                      href={`mailto:${h.email}`}
                    >
                      <IconMail />
                      <span>{h.email}</span>
                    </a>
                  </div>
                )}
                {h.website && (
                  <div>
                    <a
                      className="text-indigo-600 hover:underline inline-flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={h.website}
                    >
                      <IconLink />
                      <span className="truncate max-w-[220px]">
                        {h.website}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
