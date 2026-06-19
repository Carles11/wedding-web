import { MultilingualLogic } from "@/1-widgets/marketing/ui";
import CombatMatrix from "@/1-widgets/marketing/ui/features/CombatMatrix";
import MultilingualCTA from "@/1-widgets/marketing/ui/features/MultilingualCTA";
import MultilingualFAQ from "@/1-widgets/marketing/ui/features/MultilingualFAQ";
import { t } from "@/4-shared/helpers/t";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export const MultilingualMatrixPage = ({ translations, lang }: Props) => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Multilingual Wedding Website Engine",
    serviceType: "Communication & Localization",
    provider: { "@id": "#software" },
    description:
      "Native support for 11+ scripts including Arabic, Hindi, and Chinese.",
    areaServed: "Global",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Translation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Right-to-Left (RTL) Support",
          },
        },
      ],
    },
  };

  return (
    <div className="pt-0 md:pt-12">
      <JsonLd data={serviceSchema} />
      <Heading
        as="h1"
        id="ml-title"
        className="text-3xl md:text-4xl font-bold text-center p-8"
      >
        {t(
          translations,
          "marketing.multilingual.title.part1",
          "One Website. Every Language.",
        )}
        <span className="block mt-2 text-emerald-600/700 dark:text-emerald-400">
          {t(
            translations,
            "marketing.multilingual.title.part2",
            "No Guest Left Behind.",
          )}
        </span>
      </Heading>
      {/* 1. The Technical Proof */}
      <MultilingualLogic translations={translations} />
      {/* 2. The Competitive Advantage */}
      <CombatMatrix translations={translations} />
      {/* 3. Friction Removal (Feature-Specific FAQ) */}
      <MultilingualFAQ translations={translations} />
      {/* 4. The Close (High-Impact CTA with "Home" Slogan) */}
      <MultilingualCTA translations={translations} lang={lang} />
    </div>
  );
};
