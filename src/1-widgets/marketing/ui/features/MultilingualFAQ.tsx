import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";

type Props = {
  translations: MarketingTranslations;
};

export default function MultilingualFAQ({ translations }: Props) {
  const faqs = [
    {
      q: t(
        translations,
        "marketing.ml_faq.q1",
        "How do guests see the right language?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a1",
        "WeddWeb uses edge-computed locale detection. We check the guest's browser language instantly and serve the correct version without any 'flicker' or redirects.",
      ),
    },
    {
      q: t(
        translations,
        "marketing.ml_faq.q2",
        "Can I mix LTR and RTL scripts on one site?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a2",
        "Absolutely. You can have your main site in English (LTR) and a secondary version in Arabic (RTL). Our engine handles the directional layout shift automatically.",
      ),
    },
    {
      q: t(
        translations,
        "marketing.ml_faq.q3",
        "Does the RSVP form work in all 11 languages?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a3",
        "Yes. Every guest interaction, from the RSVP buttons to the success messages, is fully localized in the language they are viewing.",
      ),
    },
  ];

  return (
    <section className="w-full py-24 px-6 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <Heading as="h2" className="text-3xl font-bold mb-12 text-center pb-6">
          {t(translations, "marketing.ml_faq.title", "Multilingual FAQ")}
        </Heading>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-bold mb-3 text-gray-900 pb-4 ">
                {faq.q}
              </h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
