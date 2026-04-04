import { MultilingualLogic } from "@/1-widgets/marketing/ui";
import CombatMatrix from "@/1-widgets/marketing/ui/features/CombatMatrix";
import MultilingualCTA from "@/1-widgets/marketing/ui/features/MultilingualCTA";
import MultilingualFAQ from "@/1-widgets/marketing/ui/features/MultilingualFAQ";
import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export const MultilingualMatrixPage = ({ translations, lang }: Props) => {
  return (
    <div className="pt-0 md:pt-12">
      {" "}
      <Heading
        as="h2"
        id="ml-title"
        className="text-3xl md:text-4xl font-bold text-center pt-24 md:pt-8"
      >
        {t(
          translations,
          "marketing.multilingual.title.part1",
          "One Platform. 11 Languages.",
        )}
        <span className="block mt-2 text-emerald-600">
          {t(
            translations,
            "marketing.multilingual.title.part2",
            "Every Script.",
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
