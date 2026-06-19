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
        "How does my grandmother in Mumbai get the site in Hindi—without us having to do anything?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a1",
        "WeddWeb detects her browser language at the network edge—before the page even loads—and serves her the Hindi version instantly. She will never see a language-selector or experience a redirect. It simply arrives in her script, as if you wrote it just for her.",
      ),
    },
    {
      q: t(
        translations,
        "marketing.ml_faq.q2",
        "Can our Arabic-speaking guests get a right-to-left site while our English-speaking guests get a left-to-right one?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a2",
        "Exactly. Your Arabic version is served with the correct right-to-left layout at the HTML level—not a cosmetic CSS override. Every guest reads a site that was designed for their script, not adapted from someone else's.",
      ),
    },
    {
      q: t(
        translations,
        "marketing.ml_faq.q3",
        "Will all those translated pages still exist years after the wedding?",
      ),
      a: t(
        translations,
        "marketing.ml_faq.a3",
        "Yes. Unlike platforms that hand you a temporary rental, WeddWeb keeps every language version of your site online indefinitely. When your children ask to see it, when a niece in Tokyo searches for it, the story will be there—in all 11 scripts, perfectly rendered, optimized for search visibility.",
      ),
    },
  ];

  return (
    <section className="w-full py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-3xl mx-auto">
        <Heading as="h2" className="text-3xl font-bold mb-12 text-center pb-6">
          {t(
            translations,
            "marketing.ml_faq.title",
            "Questions You Two Deserve Answers To",
          )}
        </Heading>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 pb-4 ">
                {faq.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
