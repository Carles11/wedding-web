import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

interface Person {
  name: string;
  email?: string;
  phone?: string;
}

interface ContactContent {
  headline?: string;
  people?: Person[];
}

interface ContactData {
  title?: string;
  content?: ContactContent;
}

type ContactSectionProps = {
  data: ContactData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * ContactSection (server component)
 * Renders couple contact info.
 * Anchor: id="contact"
 */
export default function ContactSection({
  data,
  lang,
  translations,
}: ContactSectionProps) {
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
    translations?.["menu.contact"] ||
    "Contact";

  const people: Person[] = data?.content?.people ?? [];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 bg-neutral-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2
          id="contact-heading"
          className="text-2xl font-semibold text-neutral-800 mb-6"
        >
          {headline}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {people.map((p: Person, i: number) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
              <div className="text-lg font-semibold text-neutral-800">
                {p.name}
              </div>
              <div className="text-sm text-neutral-600 mt-2">
                {p.email && (
                  <div>
                    <a href={`mailto:${p.email}`} className="hover:underline">
                      {p.email}
                    </a>
                  </div>
                )}
                {p.phone && (
                  <div>
                    <a href={`tel:${p.phone}`} className="hover:underline">
                      {p.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
