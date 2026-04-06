import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import Link from "next/link";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function MultilingualCTA({ translations, lang }: Props) {
  return (
    <section className="w-full py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-emerald-900 text-white shadow-2xl overflow-hidden relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50" />

        <Heading
          as="h2"
          className="text-4xl md:text-5xl font-bold mb-6 relative z-10"
        >
          {t(
            translations,
            "marketing.ml_cta.title",
            "Your Story Deserves to Be Told in Every Language.",
          )}
        </Heading>

        <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
          {t(
            translations,
            "marketing.ml_cta.subtitle",
            "Start building your permanent digital home today. No ads. No data selling. No expiry date. Just the two of you, and every guest who loves you.",
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <Link
            href={`/${lang}/auth/signup`}
            className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-full hover:bg-emerald-50 transition-all transform hover:scale-105"
          >
            {t(
              translations,
              "marketing.pricing.free_plan_cta",
              "Begin Your Story, Free",
            )}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className="px-8 py-4 bg-emerald-800/50 text-white font-semibold rounded-full border border-emerald-700 hover:bg-emerald-800 transition-all"
          >
            {t(
              translations,
              "marketing.ml_cta.button.secondary",
              "See Pricing",
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
