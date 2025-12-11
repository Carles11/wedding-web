import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

interface Hotel {
  name: string | Record<string, string>;
  address: string | Record<string, string>;
  phone?: string;
  email?: string;
  website?: string;
}

interface AccommodationData {
  title?: string | Record<string, string>;
  content?: {
    headline?: string | Record<string, string>;
    hotels?: Hotel[];
  };
}

type AccommodationSectionProps = {
  data: AccommodationData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * AccommodationSection (server component)
 * Renders a list of hotels with contact links.
 * Anchor: id="accommodation"
 */
export default function AccommodationSection({
  data,
  lang,
  translations,
}: AccommodationSectionProps) {
  const headline =
    (typeof data?.title === "string"
      ? data.title
      : getTextForLang(data?.title, lang, "")) ||
    (typeof data?.content?.headline === "string"
      ? data.content.headline
      : getTextForLang(data?.content?.headline, lang, "")) ||
    translations?.["menu.accommodation"] ||
    "Accommodation";

  const hotels: Hotel[] = data?.content?.hotels ?? [];

  return (
    <section
      id="accommodation"
      aria-labelledby="accommodation-heading"
      className="py-20 bg-neutral-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          id="accommodation-heading"
          className="text-2xl font-semibold text-neutral-800 mb-6"
        >
          {headline}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {hotels.map((h: Hotel, i: number) => (
            <article
              key={i}
              className="p-4 bg-white rounded-lg shadow-sm border"
            >
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
                      className="text-neutral-700 hover:underline"
                      href={`tel:${h.phone}`}
                    >
                      {h.phone}
                    </a>
                  </div>
                )}
                {h.email && (
                  <div>
                    <a
                      className="text-neutral-700 hover:underline"
                      href={`mailto:${h.email}`}
                    >
                      {h.email}
                    </a>
                  </div>
                )}
                {h.website && (
                  <div>
                    <a
                      className="text-indigo-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={h.website}
                    >
                      {h.website}
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
