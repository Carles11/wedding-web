import type { HeroSection as HeroSectionType } from "@/4-shared/types";
import Image from "next/image";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import Heading from "@/4-shared/ui/typography/Heading";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type HeroSectionProps = {
  hero: HeroSectionType;
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * HeroSection
 * - Renders hero image + title + description (from per-site sections JSONB)
 * - Optionally shows small info row with labels (When / Where / Dress code) using translations
 *
 * Notes:
 * - translations is passed from server via getMergedTranslations(siteId, lang)
 * - All content text uses getTextForLang to prefer the requested lang with a fallback (site defaults)
 */
export default function HeroSection({
  hero,
  lang,
  translations,
}: HeroSectionProps) {
  const title = getTextForLang(hero.title, lang, "ca");
  const description = getTextForLang(hero.content?.description, lang, "ca");
  const backgroundImage = hero.content?.backgroundImage ?? "";

  // Optional structured fields inside hero.content (may not exist for all sites)
  // We safely read them and prefer the lang-specific values if present.
  const heroDate = getTextForLang(
    hero.content?.date as Record<string, string> | undefined,
    lang,
    ""
  );
  const heroLocation = getTextForLang(
    hero.content?.location as Record<string, string> | undefined,
    lang,
    ""
  );
  const heroDresscode = getTextForLang(
    hero.content?.dresscode as Record<string, string> | undefined,
    lang,
    ""
  );

  const whenLabel = translations?.["when"] ?? "When";
  const whereLabel = translations?.["where"] ?? "Where";
  const dresscodeLabel = translations?.["dresscode"] ?? "Dress code";

  return (
    <section
      className="relative w-full h-[100vh] min-h-[340px] overflow-hidden flex items-center justify-center shadow-lg"
      aria-labelledby="hero-title"
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title || "Hero image for event"}
          fill
          loading="eager"
          priority
          className="object-cover object-center brightness-[.84] contrast-125 sepia hue-rotate-[350deg] saturate-140"
          style={{
            filter:
              "grayscale(0.07) sepia(0.18) contrast(1.15) brightness(0.84) hue-rotate(-10deg) saturate(1.4)",
          }}
        />
      )}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center">
        <Heading
          id="hero-title"
          as="h1"
          className="font-light text-white text-center tracking-wide drop-shadow-lg max-w-[90%] md:max-w-3xl"
        >
          {title}
        </Heading>

        {description && (
          <p className="mt-4 font-sans text-lg md:text-xl text-white text-center drop-shadow max-w-[85%] md:max-w-2xl">
            {description}
          </p>
        )}

        {/* Optional small info row using translations and site-provided values */}
        {(heroDate || heroLocation || heroDresscode) && (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 text-white/95 text-sm md:text-base">
            {heroDate && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded">
                <span className="font-semibold">{whenLabel}:</span>
                <span className="whitespace-nowrap">{heroDate}</span>
              </div>
            )}

            {heroLocation && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded">
                <span className="font-semibold">{whereLabel}:</span>
                <span className="whitespace-nowrap">{heroLocation}</span>
              </div>
            )}

            {heroDresscode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded">
                <span className="font-semibold">{dresscodeLabel}:</span>
                <span className="whitespace-nowrap">{heroDresscode}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
