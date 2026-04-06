import type { SupportedLanguage } from "@/4-shared/config/i18n";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Generates a Schema.org BreadcrumbList object from an ordered array of items.
 * @param items - Ordered breadcrumb trail. Each item must have an absolute `item` URL.
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/**
 * Localized breadcrumb labels for all 11 supported languages.
 * Used by marketing pages to build the "Home > Page" trail.
 */
export const BREADCRUMB_LABELS: Record<
  SupportedLanguage,
  { home: string; pricing: string; faq: string }
> = {
  en: { home: "Home", pricing: "Pricing", faq: "FAQ" },
  zh: { home: "首页", pricing: "定价", faq: "常见问题" },
  hi: { home: "होम", pricing: "मूल्य निर्धारण", faq: "सामान्य प्रश्न" },
  es: { home: "Inicio", pricing: "Precios", faq: "Preguntas Frecuentes" },
  ca: { home: "Inici", pricing: "Preus", faq: "Preguntes Freqüents" },
  ar: { home: "الرئيسية", pricing: "الأسعار", faq: "الأسئلة الشائعة" },
  fr: { home: "Accueil", pricing: "Tarifs", faq: "FAQ" },
  de: { home: "Startseite", pricing: "Preise", faq: "FAQ" },
  pt: { home: "Início", pricing: "Preços", faq: "Perguntas Frequentes" },
  ru: { home: "Главная", pricing: "Цены", faq: "Вопросы и ответы" },
  it: { home: "Home", pricing: "Prezzi", faq: "Domande Frequenti" },
};
