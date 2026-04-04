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
          translations["marketing.faq.title"] ?? "Frequently Asked Questions"
        }
        summary={
          translations["marketing.faq.summary"] ??
          "Answers to common questions about wedding websites, planning, and related services."
        }
        fine_print={
          translations["marketing.faq.fine_print"] ??
          "For more details or support, contact our team."
        }
      >
        <FAQList t={translations} />
      </FAQPageShell>
    </>
  );
}
