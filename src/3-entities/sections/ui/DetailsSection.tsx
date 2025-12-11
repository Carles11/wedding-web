import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

interface DetailsSectionData {
  title?: Record<string, string>;
  content?: {
    headline?: Record<string, string>;
    days?: Array<{
      slug: string;
      label: Record<string, string>;
      events?: Array<{
        time: string;
        title: Record<string, string>;
        location: Record<string, string>;
      }>;
    }>;
  };
}

type DetailsSectionProps = {
  data: DetailsSectionData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * DetailsSection (server component)
 * Renders the program timeline (day before / wedding day / day after).
 * Anchor: id="details"
 */
export default function DetailsSection({
  data,
  lang,
  translations,
}: DetailsSectionProps) {
  // Prefer title JSONB field, fall back to content.headline
  const headline =
    getTextForLang(data?.title, lang, "") ||
    getTextForLang(data?.content?.headline, lang, "") ||
    translations?.["menu.details"] ||
    "Details";

  const days = data?.content?.days ?? [];

  return (
    <section
      id="details"
      aria-labelledby="details-heading"
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          id="details-heading"
          className="text-2xl font-semibold text-neutral-800 mb-6"
        >
          {headline}
        </h2>

        <div className="space-y-8">
          {days.map((day) => (
            <div key={day.slug} className="border rounded-lg p-4 bg-neutral-50">
              <h3 className="text-lg font-medium text-neutral-700 mb-3">
                {getTextForLang(day.label, lang, "")}
              </h3>

              <ul className="space-y-3">
                {Array.isArray(day.events) &&
                  day.events.map((ev, idx: number) => (
                    <li
                      key={idx}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div className="text-neutral-600 font-mono text-sm w-28">
                        {ev.time}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-800">
                          {getTextForLang(ev.title, lang, "")}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {getTextForLang(ev.location, lang, "")}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
