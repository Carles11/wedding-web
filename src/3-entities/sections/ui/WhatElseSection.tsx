import React from "react";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

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

  return (
    <SectionContainer
      id="whatelse"
      heading={headline}
      headingId="details-heading"
      variant="white"
      withDivider
      dividerMotive="love1"
      dividerClassName="w-32 h-auto" // optional: tune size via Tailwind
      dividerSize={110} // optional: exact pixel size for next/image
      dividerOpacity={0.06} // optional: pick opacity
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it: WhatElseItem, idx: number) => (
          <article key={idx} className="p-4 border rounded-lg bg-neutral-50">
            <h3 className="font-semibold text-neutral-800">
              {getTextForLang(it.title, lang, "")}
            </h3>
            {it.description && (
              <p className="text-sm text-neutral-600 mt-2">
                {getTextForLang(it.description, lang, "")}
              </p>
            )}
            {it.url && (
              <div className="mt-3">
                <a
                  className="text-indigo-600 hover:underline"
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {it.url}
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
