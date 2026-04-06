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
          translations["marketing.faq.title"] ??
          "Your Wedding, Every Question Answered"
        }
        summary={
          translations["marketing.faq.summary"] ??
          "Everything you need to know about building a wedding website that lasts a lifetime."
        }
        fine_print={
          translations["marketing.faq.fine_print"] ??
          "Still have questions? Write to us."
        }
      >
        <FAQList t={translations} />
      </FAQPageShell>
    </>
  );
}
