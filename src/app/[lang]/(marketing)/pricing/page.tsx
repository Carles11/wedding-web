import PricingPage from "@/0-pages/(marketing)/PricingPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { getPriceForCountry } from "@/4-shared/helpers/billing/geoCurrency";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  BREADCRUMB_LABELS,
  generateBreadcrumbSchema,
} from "@/4-shared/lib/seo/generateBreadcrumbSchema";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { metadataBase } = getMetadataBase(host, false);

  const seo = getSEOMetadata(lang, "marketing", "pricing");

  // SEO FIX: Path should match the actual slug in your URL (e.g., /en/pricing)
  const path = "pricing";

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

  const headersList = await headers();
  const countryHeader = headersList.get("x-vercel-ip-country") || "US";
  const resolvedPrice = getPriceForCountry(countryHeader);

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const { baseUrl } = getMetadataBase(host, false);

  // Server-side fetch: Zero hydration flicker
  const translations = await fetchMarketingTranslations(lang, "en");

  const labels =
    BREADCRUMB_LABELS[lang as SupportedLanguage] ?? BREADCRUMB_LABELS.en;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, item: `${baseUrl}/${lang}` },
    { name: labels.pricing, item: `${baseUrl}/${lang}/pricing` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PricingPage
        translations={translations}
        lang={lang}
        priceOverrides={resolvedPrice}
      />
    </>
  );
}
