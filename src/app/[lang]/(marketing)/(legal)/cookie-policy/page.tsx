import CookiePolicyPage from "@/0-pages/(marketing)/legal/CookiePolicyPage";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
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
  const seo = getSEOMetadata(lang, "marketing", "cookie-policy");
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
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

  const translations = await fetchMarketingTranslations(lang, "en");
  return <CookiePolicyPage translations={translations} lang={lang} />;
}
