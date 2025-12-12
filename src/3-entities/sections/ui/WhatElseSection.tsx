import React from "react";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";

interface WhatElseItem {
  title: Record<string, string>;
  description?: Record<string, string>;
  url?: string;
}

interface WhatElseData {
  title?: Record<string, string>;
  content?: {
    headline?: Record<string, string>;
    items?: WhatElseItem[];
  };
}

/**
 * WhatElseSection: attractions and activities.
 * - Anchor: id="whatelse"
 */
type WhatElseSectionProps = {
  data: WhatElseData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

function getLearnMoreLabel(
  lang: string,
  translations?: TranslationDictionary | null
) {
  const dbLabel = translations?.["common.learn_more"];
  if (dbLabel) return dbLabel;

  switch (lang) {
    case "es":
      return "Conoce más";
    case "ca":
      return "Coneix més";
    default:
      return "Learn more";
  }
}

function getLearnMoreAria(
  lang: string,
  titleText: string,
  translations?: TranslationDictionary | null
) {
  const dbAria = translations?.["common.learn_more_aria"];
  if (dbAria)
    return (
      dbAria.replace("{title}", titleText) ||
      `${getLearnMoreLabel(lang, translations)} - ${titleText}`
    );
  return `${getLearnMoreLabel(lang, translations)} - ${titleText}`;
}

export default function WhatElseSection({
  data,
  lang,
  translations,
}: WhatElseSectionProps) {
  const headline =
    getTextForLang(data?.title, lang, "") ||
    getTextForLang(data?.content?.headline, lang, "") ||
    translations?.["menu.what_else"] ||
    "What else to see?";

  const items: WhatElseItem[] = data?.content?.items ?? [];
  const learnMoreLabel = getLearnMoreLabel(lang, translations);

  return (
    <SectionContainer
      id="whatelse"
      heading={headline}
      headingId="whatelse-heading"
      variant="white"
      withDivider
      dividerMotive="love1"
      dividerClassName="w-32 h-auto"
      dividerSize={110}
      dividerOpacity={0.06}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it: WhatElseItem, idx: number) => {
          const titleText = getTextForLang(it.title, lang, "");
          const descText = it.description
            ? getTextForLang(it.description, lang, "")
            : null;
          const ariaLabel = getLearnMoreAria(lang, titleText, translations);

          return (
            <article key={idx} className="p-4 border rounded-lg bg-neutral-50">
              <h3 className="font-semibold text-2xl text-neutral-800">
                {titleText}
              </h3>

              {descText && (
                <p className="text-sm text-neutral-600 mt-2">{descText}</p>
              )}

              {it.url && (
                <div className="mt-3">
                  <UnderlinedLink
                    href={it.url}
                    thicknessClass="h-0.5"
                    durationMs={350}
                    ariaLabel={ariaLabel}
                    external
                  >
                    {learnMoreLabel}
                  </UnderlinedLink>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </SectionContainer>
  );
}
