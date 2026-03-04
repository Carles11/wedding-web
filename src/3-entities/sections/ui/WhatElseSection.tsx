import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";
import type {
  WhatToSeeEntryFull,
  TranslationDictionary,
} from "@/4-shared/types";

type WhatElseSectionProps = {
  items: WhatToSeeEntryFull[];
  translations: TranslationDictionary;
  lang: string;
};

function getLearnMoreLabel(
  lang: string,
  translations: TranslationDictionary,
): string {
  return (
    translations["common.learn_more"] ||
    (lang === "es" ? "Conoce más" : lang === "ca" ? "Coneix més" : "Learn more")
  );
}

function getLearnMoreAria(
  lang: string,
  titleText: string,
  translations: TranslationDictionary,
): string {
  const dbAria = translations["common.learn_more_aria"];
  if (dbAria)
    return (
      dbAria.replace("{title}", titleText) ||
      `${getLearnMoreLabel(lang, translations)} - ${titleText}`
    );
  return `${getLearnMoreLabel(lang, translations)} - ${titleText}`;
}

function getTitleFallback(it: WhatToSeeEntryFull, lang: string): string {
  // Try exact language, then English, then any available, then empty string
  if (typeof it.name === "string") return it.name;
  if (!it.name) return "";
  return it.name[lang] || it.name["en"] || Object.values(it.name)[0] || "";
}

function getDescFallback(it: WhatToSeeEntryFull, lang: string): string {
  if (!it.description) return "";
  return (
    it.description[lang] ||
    it.description["en"] ||
    Object.values(it.description)[0] ||
    ""
  );
}

export default function WhatElseSection({
  items,
  translations,
  lang,
}: WhatElseSectionProps) {
  const heading =
    translations["menu.what_else"] ||
    (lang === "es"
      ? "¿Qué más ver?"
      : lang === "ca"
        ? "Què més veure?"
        : "What else to see?");

  const learnMoreLabel = getLearnMoreLabel(lang, translations);

  return (
    <SectionContainer
      id="whatelse"
      heading={heading}
      headingId="whatelse-heading"
      variant="white"
      withDivider
      dividerMotive="love1"
      dividerClassName="w-32 h-auto"
      dividerSize={110}
      dividerOpacity={0.06}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it) => {
          const titleKey = `what_to_see.title.${it.id}`;
          const descKey = `what_to_see.description.${it.id}`;

          // Fallback strategy: translation, then language key, then "en", then any
          const titleText =
            translations[titleKey] || getTitleFallback(it, lang) || "";

          const descText =
            translations[descKey] || getDescFallback(it, lang) || "";

          const ariaLabel = getLearnMoreAria(lang, titleText, translations);

          return (
            <article
              key={it.id}
              className="p-4 border rounded-lg bg-neutral-50"
            >
              <h3 className="font-semibold text-2xl text-neutral-800">
                {titleText}
              </h3>
              {descText && (
                <p className="text-sm text-neutral-600 mt-2">{descText}</p>
              )}
              {it.location_url && (
                <div className="mt-3">
                  <UnderlinedLink
                    href={it.location_url}
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
