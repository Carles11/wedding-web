export const dynamic = "force-dynamic";

/**
 * Root SSR page for weddweb.com platform.
 * Detects marketing vs. tenant domains and SSR redirects accordingly.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";
import { fetchMarketingTranslations } from "@/4-shared/lib/marketingTranslations";
import MarketingPageWrapper from "@/app/_components/MarketingPageWrapper";

// Only show marketing landing on the SaaS home domains:
const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
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
  if (MARKETING_DOMAINS.includes(host)) {
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
