import FAQPage from "@/0-pages/(marketing)/FAQPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import type { Metadata } from "next";

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

  const seo = getSEOMetadata(lang, "marketing", "faq");
  const baseUrl = "https://weddweb.com";
  const path = "marketing/faq";

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
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
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

  // Direct server-side fetch for zero-JS-flicker
  const translations = await fetchMarketingTranslations(lang, "en");

  return (
    <>
      <FAQPage translations={translations} lang={lang} />;
      <Footer lang={lang} translations={translations} />
    </>
  );
}
