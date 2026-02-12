import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import MarketingPageWrapper from "@/app/(marketing)/_components/MarketingPageWrapper";
import { getSEOMetadata } from "@/4-shared/config/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
  "ca",
  "ar",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
];

function isValidLanguage(lang: string | undefined): lang is string {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const seo = getSEOMetadata(lang, "marketing");

  const images = seo.ogImage ? [{ url: seo.ogImage }] : [];
  const languages =
    seo.alternateLanguages?.reduce(
      (acc, alt) => {
        acc[alt.locale] = alt.url;
        return acc;
      },
      {} as Record<string, string>,
    ) ?? {};

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      images,
      locale: seo.locale,
      type: "website",
      siteName: "WeddWeb",
    },
    twitter: {
      card: seo.twitterCard ?? "summary_large_image",
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl,
      languages,
    },
  } as Metadata;
}

/**
 * Marketing landing page - only shows marketing content.
 * Routing logic is handled by root page.tsx.
 */
export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchMarketingTranslations(lang, "en");

  return (
    <MarketingPageWrapper initialLang={lang} translations={translations} />
  );
}
