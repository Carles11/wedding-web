import PrivacyPolicyPage from "@/0-pages/(marketing)/legal/PrivacyPolicyPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import type { Metadata } from "next";
import { headers } from "next/headers";

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

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { metadataBase } = getMetadataBase(host, false);

  const seo = getSEOMetadata(lang, "marketing", "privacy-policy");

  // SEO FIX: Path should match your actual URL (e.g., weddweb.com/en/privacy-policy)
  const path = "privacy-policy";

  // Build Hreflang Alternates for 11 languages
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

  return (
    <>
      <PrivacyPolicyPage translations={translations} lang={lang} />
      <Footer lang={lang} translations={translations} />
    </>
  );
}
