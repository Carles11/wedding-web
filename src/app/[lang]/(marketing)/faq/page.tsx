import FAQPage from "@/0-pages/(marketing)/FAQPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  BREADCRUMB_LABELS,
  generateBreadcrumbSchema,
} from "@/4-shared/lib/seo/generateBreadcrumbSchema";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import type { Metadata } from "next";
import { headers } from "next/headers";

/**
 * FAQ SEO Metadata
 * Ensures deep-linking for all supported languages and x-default fallback.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { metadataBase } = getMetadataBase(host, false);

  const seo = getSEOMetadata(lang, "marketing", "faq");

  // SEO FIX: Ensuring path matches the actual URL segment /en/faq
  const path = "faq";

  // Build Hreflang Alternates for all 11 languages
  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach((l) => {
    languages[l] = `/${l}/${path}`;
  });

  const ogImage = seo.ogImage || "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${lang}/${path}`,
      languages: {
        ...languages,
        "x-default": `/en/${path}`,
      },
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: `/${lang}/${path}`,
      siteName: "WeddWeb",
      locale: `${lang}_${lang.toUpperCase()}`,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: [ogImage],
    },
    // Standard indexing for helpful content
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { baseUrl } = getMetadataBase(host, false);

  // Direct server-side fetch for zero-JS-flicker
  const translations = await fetchMarketingTranslations(lang, "en");

  const labels =
    BREADCRUMB_LABELS[lang as SupportedLanguage] ?? BREADCRUMB_LABELS.en;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, item: `${baseUrl}/${lang}` },
    { name: labels.faq, item: `${baseUrl}/${lang}/faq` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FAQPage translations={translations} lang={lang} />
    </>
  );
}
