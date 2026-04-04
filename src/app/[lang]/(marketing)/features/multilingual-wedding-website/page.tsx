import { MarketingFloatingLanguageSelector } from "@/1-widgets/marketing/ui";
import CombatMatrix from "@/1-widgets/marketing/ui/CombatMatrix";
import MultilingualLogic from "@/1-widgets/marketing/ui/MultilingualLogic";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import {
  BREADCRUMB_LABELS,
  generateBreadcrumbSchema,
} from "@/4-shared/lib/seo/generateBreadcrumbSchema";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";

import { Metadata } from "next";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ lang?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * AI-SEO Metadata Generation
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await resolveSearchParams(searchParams);
  const lang = resolveLanguageFromParams(
    resolvedParams.lang,
    resolvedSearch,
    isValidLanguage,
  ) as SupportedLanguage;

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { metadataBase } = getMetadataBase(host, false);

  // Custom SEO for this specific feature page
  const seo = getSEOMetadata(lang, "marketing", "features_multilingual");

  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach((l) => {
    languages[l] = `/${l}/features/multilingual-wedding-website`;
  });

  return {
    metadataBase,
    title:
      seo.title || "Multilingual Wedding Websites | Native 11-Language Support",
    description:
      seo.description ||
      "Create a professional wedding website in 11 languages. Native RTL support for Arabic, Hindi, Chinese, and more.",
    alternates: {
      canonical: `/${lang}/features/multilingual-wedding-website`,
      languages: {
        ...languages,
        "x-default": "/en/features/multilingual-wedding-website",
      },
    },
    robots: { index: true, follow: true },
  };
}

/**
 * The Multilingual Feature Landing Page
 */
export default async function MultilingualFeaturePage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await resolveSearchParams(searchParams);
  const lang = resolveLanguageFromParams(
    resolvedParams.lang,
    resolvedSearch,
    isValidLanguage,
  ) as SupportedLanguage;

  const translations = await fetchMarketingTranslations(lang, "en");
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { baseUrl } = getMetadataBase(host, false);

  // Breadcrumb Schema for AI-SEO
  const labels = BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, item: `${baseUrl}/${lang}` },
    { name: "Features", item: `${baseUrl}/${lang}#features` },
    {
      name: "Multilingual",
      item: `${baseUrl}/${lang}/features/multilingual-wedding-website`,
    },
  ]);

  return (
    <main className="marketing-theme">
      <JsonLd data={breadcrumbSchema} />
      <MarketingFloatingLanguageSelector
        currentLang={lang}
        label={translations["marketing.lang_selector.label"]}
      />
      {/* The Widget we built. It already contains its own 
          HowTo Schema linked to #software 
      */}
      {/* 1. The Technical Proof */}
      <MultilingualLogic translations={translations} />

      {/* 2. The Competitive Advantage */}
      <CombatMatrix translations={translations} />
      <Footer lang={lang} translations={translations} />
    </main>
  );
}
