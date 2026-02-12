export const dynamic = "force-dynamic";

/**
 * Root SSR page for weddweb.com platform.
 * Detects marketing vs. tenant domains and SSR redirects accordingly.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import MarketingPageWrapper from "@/app/(marketing)/_components/MarketingPageWrapper";
import { getSEOMetadata } from "@/4-shared/config/seo";
import type { Metadata } from "next";

// Only show marketing landing on the SaaS home domains:
const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

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

/**
 * Generate page metadata using structured SEO config per-locale.
 */
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>; // ← Changed to Promise
}) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;

  // Host header, always lowercase, trimmed for robust matching.
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();

  // Marketing domains = always show platform landing.
  if (MARKETING_DOMAINS.includes(host) || host === "localhost:3000") {
    const requested = params?.lang;
    const lang = isValidLanguage(requested) ? requested : "en";
    const translations = await fetchMarketingTranslations(lang, "en");

    return (
      <MarketingPageWrapper initialLang={lang} translations={translations} />
    );
  }

  // Try SSR tenant lookup by host for user event/custom domains.
  const siteId = await getSiteIdForDomain(host);
  if (siteId) {
    // SSR: redirect "/" → /[default_lang] (e.g. /ca) for event domain
    const defaultLang = await getSiteDefaultLang(siteId);
    redirect(`/${defaultLang}`);
  }

  // Fallback: Unknown domain, show marketing page with default language
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchMarketingTranslations(lang, "en");

  return (
    <MarketingPageWrapper initialLang={lang} translations={translations} />
  );
}
