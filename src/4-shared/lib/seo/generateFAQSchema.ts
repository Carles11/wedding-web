// src/4-shared/lib/seo/generateFAQSchema.ts
import { faqCategories } from "@/1-widgets/marketing/model/faqCategories";
import { TranslationDictionary } from "@/4-shared/types";

export function generateFAQSchema(t: TranslationDictionary) {
  const categories = faqCategories(t);

  // Flatten all categories into a single list of questions for the Schema
  const allQuestions = categories.flatMap((cat) =>
    cat.questions.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.a,
      },
    })),
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions,
  };
}
