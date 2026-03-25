import CookiePolicyPage from "@/0-pages/(marketing)/legal/CookiePolicyPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import type { Metadata } from "next";

/**
 * Cookie Policy SEO Metadata
 * Completes the legal trust signals for global indexing.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const seo = getSEOMetadata(lang, "marketing", "cookie-policy");
  const baseUrl = "https://weddweb.com";
  const path = "marketing/legal/cookie-policy";

  // Build Hreflang Alternates for deep-linking
  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach((l) => {
    languages[l] = `${baseUrl}/${l}/${path}`;
  });

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/${path}`,
      languages: {
        ...languages,
        "x-default": `${baseUrl}/en/${path}`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/${path}`,
      images: seo.ogImage
        ? [seo.ogImage]
        : [`${baseUrl}/assets/og/weddweb-OG.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
    },
    // Standard indexing for E-E-A-T trust signals
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

  // Direct Server-side translation fetch
  const translations = await fetchMarketingTranslations(lang, "en");

  return <CookiePolicyPage translations={translations} lang={lang} />;
}
