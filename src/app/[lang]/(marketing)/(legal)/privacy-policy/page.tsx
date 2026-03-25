import PrivacyPolicyPage from "@/0-pages/(marketing)/legal/PrivacyPolicyPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import type { Metadata } from "next";

/**
 * Privacy Policy SEO Metadata
 * Vital for site authority and GDPR/Legal trust signals.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const seo = getSEOMetadata(lang, "marketing", "privacy-policy");
  const baseUrl = "https://weddweb.com";
  const path = "marketing/legal/privacy-policy";

  // Build Hreflang Alternates
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
    },
    // Indexing allowed for E-E-A-T signals (Trustworthiness)
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

  // Server-side fetch for zero-hydration flicker
  const translations = await fetchMarketingTranslations(lang, "en");

  return <PrivacyPolicyPage translations={translations} lang={lang} />;
}
