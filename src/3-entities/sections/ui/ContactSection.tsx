import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";

interface ContactPerson {
  name: string;
  email?: string;
  phone?: string;
}

interface ContactSectionData {
  title?: string;
  subtitle?: string | Record<string, string>;
  content?: {
    headline?: string;
    people?: ContactPerson[];
  };
}

/**
 * ContactSection: simple couple contacts.
 * - Anchor: id="contact"
 */
type ContactSectionProps = {
  data: ContactSectionData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

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

  const subtitle = getTextForLang(
    data?.subtitle as Record<string, string> | undefined,
    lang,
    ""
  );

  const people: ContactPerson[] = data?.content?.people ?? [];

  // Reuse the site's underline appearance so all links look consistent
  const underlineConfig = {
    initialHeightClass: "max-h-[2px]",
    expandedHeightClass: "group-hover:max-h-[10px] group-focus:max-h-[10px]",
    durationMs: 300,
  };

  return (
    <SectionContainer
      id="contact"
      heading={headline}
      headingId="accommodation-heading"
      subtitle={subtitle}
      variant="muted"
      withDivider
      dividerMotive="contact1"
      dividerClassName="w-36 h-auto"
      dividerSize={120}
      dividerOpacity={0.055}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {people.map((p: ContactPerson, i: number) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-lg font-semibold text-neutral-800">
              {p.name}
            </div>
            <div className="text-sm text-neutral-600 mt-2 space-y-1">
              {p.email && (
                <div>
                  <UnderlinedLink
                    href={`mailto:${p.email}`}
                    className="text-neutral-700"
                    ariaLabel={`Email ${p.name}`}
                    thicknessClass="h-0.5"
                    {...underlineConfig}
                  >
                    {p.email}
                  </UnderlinedLink>
                </div>
              )}
              {p.phone && (
                <div>
                  <UnderlinedLink
                    href={`tel:${p.phone}`}
                    className="text-neutral-700"
                    ariaLabel={`Call ${p.name}`}
                    thicknessClass="h-0.5"
                    {...underlineConfig}
                  >
                    {p.phone}
                  </UnderlinedLink>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
