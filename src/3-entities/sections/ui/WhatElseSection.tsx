import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

interface WhatElseItem {
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  url?: string;
}

interface WhatElseSectionData {
  title?: string | Record<string, string>;
  content?: {
    headline?: string | Record<string, string>;
    items?: WhatElseItem[];
  };
}

type WhatElseSectionProps = {
  data: WhatElseSectionData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * WhatElseSection (server component)
 * Renders free-form attractions / activities.
 * Anchor: id="whatelse"
 */
export default function WhatElseSection({
  data,
  lang,
  translations,
}: WhatElseSectionProps) {
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
    translations?.["menu.what_else"] ||
    "What else to see?";

  const items: WhatElseItem[] = data?.content?.items ?? [];

  return (
    <section
      id="whatelse"
      aria-labelledby="whatelse-heading"
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          id="whatelse-heading"
          className="text-2xl font-semibold text-neutral-800 mb-6"
        >
          {headline}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((it: WhatElseItem, idx: number) => (
            <article key={idx} className="p-4 border rounded-lg bg-neutral-50">
              <h3 className="font-semibold text-neutral-800">
                {getTextForLang(
                  it.title as Record<string, string> | undefined,
                  lang,
                  ""
                )}
              </h3>
              {it.description && (
                <p className="text-sm text-neutral-600 mt-2">
                  {getTextForLang(
                    it.description as Record<string, string> | undefined,
                    lang,
                    ""
                  )}
                </p>
              )}
              {it.url && (
                <div className="mt-3">
                  <a
                    href={it.url}
                    className="text-indigo-600 hover:underline"
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
      </div>
    </section>
  );
}
