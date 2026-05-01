import PrivacyPolicyPage from "@/0-pages/(marketing)/legal/PrivacyPolicyPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  BREADCRUMB_LABELS,
  generateBreadcrumbSchema,
} from "@/4-shared/lib/seo/generateBreadcrumbSchema";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import { legalTranslations } from "@/4-shared/lib/seo/legalMetadata";
import { normalizeMetaDescription } from "@/4-shared/lib/seo/normalizeMetaDescription";
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

  const t =
    legalTranslations[lang as SupportedLanguage] ?? legalTranslations.en;
  const path = "privacy-policy";
  const description = normalizeMetaDescription(t.privacyDesc);

  // Build Hreflang Alternates for all 11 languages
  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach((l) => {
    languages[l] = `/${l}/${path}`;
  });

  const ogImage = "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title: t.privacyTitle,
    description,
    alternates: {
      canonical: `/${lang}/${path}`,
      languages: {
        ...languages,
        "x-default": `/en/${path}`,
      },
    },
    openGraph: {
      title: t.privacyTitle,
      description,
      url: `/${lang}/${path}`,
      siteName: "WeddWeb",
      locale: `${lang}_${lang.toUpperCase()}`,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.privacyTitle,
      description,
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

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { baseUrl } = getMetadataBase(host, false);

  // Server-side fetch for zero-hydration flicker
  const translations = await fetchMarketingTranslations(lang, "en");

  const t =
    legalTranslations[lang as SupportedLanguage] ?? legalTranslations.en;
  const homeLabel =
    BREADCRUMB_LABELS[lang as SupportedLanguage]?.home ?? "Home";
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: homeLabel, item: `${baseUrl}/${lang}` },
    { name: t.privacyPageName, item: `${baseUrl}/${lang}/privacy-policy` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PrivacyPolicyPage translations={translations} lang={lang} />
    </>
  );
}
