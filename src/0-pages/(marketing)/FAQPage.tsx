"use client";

import FAQList from "@/1-widgets/marketing/ui/faq/FAQList";
import FAQPageShell from "@/1-widgets/marketing/ui/faq/FAQPageShell";
import { generateFAQSchema } from "@/4-shared/lib/seo/generateFAQSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import { MarketingTranslations } from "@/4-shared/types/marketingPage";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function FAQPage({ translations, lang }: Props) {
  // Generate the real schema based on the current translations
  const faqSchema = generateFAQSchema(translations);

  return (
    <>
      {/* 
          BEST SEO EVER: This script tag makes your FAQs 
          discoverable by both Google and AI Search Engines.
      */}
      <JsonLd data={faqSchema} />

      <FAQPageShell
        title={
          translations["marketing.faq.title"] ?? "Everything You Want to Know"
        }
        summary={
          translations["marketing.faq.summary"] ??
          "Your questions, answered honestly. From how long your site stays online to how your grandmother in Riyadh reads it in Arabic—everything about your WeddWeb experience, right here."
        }
        fine_print={
          translations["marketing.faq.fine_print"] ??
          "Still have a question? Our team is one message away."
        }
      >
        <FAQList t={translations} />
      </FAQPageShell>
    </>
  );
}
