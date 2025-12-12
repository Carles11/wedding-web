import Image from "next/image";
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
  background?:
    | {
        url?: string;
        alt?: string;
      }
    | string;
}

type ContactSectionProps = {
  data: ContactSectionData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

function normalizeBackground(raw?: ContactSectionData["background"]) {
  if (!raw) return undefined;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as { url?: string; alt?: string };
    } catch {
      return undefined;
    }
  }
  return raw as { url?: string; alt?: string };
}

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

  // Defensive parse of background
  const bg = normalizeBackground(data?.background);
  const bgUrl = bg?.url;
  const bgAlt = bg?.alt ?? "";

  const underlineConfig = {
    initialHeightClass: "max-h-[2px]",
    expandedHeightClass: "group-hover:max-h-[10px] group-focus:max-h-[10px]",
    durationMs: 300,
  };

  return (
    // Outer wrapper for full-bleed background + centered content
    <div className="relative">
      {/* Background area: mobile = full-width; md+ = anchored to the right (vertical image) */}
      {bgUrl ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
        >
          {/* 
            Mobile: w-screen centered (full-width)
            Desktop (md+): narrower box anchored to the right (here md:w-2/5) — adjust width as needed
          */}
          <div className="absolute inset-0 w-screen h-full left-1/2 -translate-x-1/2 md:w-2/5 md:left-auto md:right-0 md:translate-x-0">
            <Image
              src={bgUrl}
              alt={bgAlt}
              fill
              sizes="100vw"
              // object position: center on mobile, align to right on md+ so the vertical image sits to the right
              className="object-cover object-center md:object-right"
              priority={false}
            />
            {/* overlay only over the image area */}
            <div className="absolute inset-0 bg-white/75 md:bg-white/44" />
          </div>
        </div>
      ) : null}

      {/* SectionContainer remains the same and centers content */}
      <SectionContainer
        id="contact"
        heading={headline}
        headingId="contact-heading"
        subtitle={subtitle}
        variant="muted"
        imageBackground
        withDivider
        dividerMotive="contact1"
        dividerClassName="w-36 h-auto"
        dividerSize={120}
        dividerOpacity={0.055}
      >
        <div className="relative z-10">
          <div className="grid gap-6 md:grid-cols-2">
            {people.map((p: ContactPerson, i: number) => (
              <div
                key={i}
                className="p-4 bg-white/80 dark:bg-neutral-900/70 rounded-lg shadow-sm border"
              >
                <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
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
        </div>
      </SectionContainer>
    </div>
  );
}
