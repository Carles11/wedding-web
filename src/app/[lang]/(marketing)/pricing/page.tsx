import PricingPage from "@/0-pages/(marketing)/PricingPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  // 1. Fetch SEO config
  const seo = getSEOMetadata(lang, "marketing", "pricing");
  const baseUrl = "https://weddweb.com";

  // 2. Build Hreflang Alternates specifically for the pricing path
  const languages: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach((l) => {
    languages[l] = `${baseUrl}/${l}/marketing/pricing`;
  });

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/marketing/pricing`,
      languages: {
        ...languages,
        "x-default": `${baseUrl}/en/marketing/pricing`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/marketing/pricing`,
      images: seo.ogImage
        ? [seo.ogImage]
        : [`${baseUrl}/assets/og/weddweb-OG.png`],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
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

  // Server-side fetch: No client-side 'useEffect' needed
  const translations = await fetchMarketingTranslations(lang, "en");

  return <PricingPage translations={translations} lang={lang} />;
}
