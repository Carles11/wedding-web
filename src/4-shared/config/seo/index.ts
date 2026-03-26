// Legal Pages
import { seoMetadata as cookiePolicyEn } from "./marketing/legal/cookie-policy-en";
import { seoMetadata as privacyPolicyEn } from "./marketing/legal/privacy-policy-en";
import { seoMetadata as termsOfServiceEn } from "./marketing/legal/terms-of-service-en";

const privacyPolicySeoByLocale: Record<string, SitewideSEO> = {
  en: privacyPolicyEn,
};

const termsOfServiceSeoByLocale: Record<string, SitewideSEO> = {
  en: termsOfServiceEn,
};

const cookiePolicySeoByLocale: Record<string, SitewideSEO> = {
  en: cookiePolicyEn,
};
// Home
import { seoMetadata as homeAr } from "./marketing/home/ar";
import { seoMetadata as homeCa } from "./marketing/home/ca";
import { seoMetadata as homeDe } from "./marketing/home/de";
import { seoMetadata as homeEn } from "./marketing/home/en";
import { seoMetadata as homeEs } from "./marketing/home/es";
import { seoMetadata as homeFr } from "./marketing/home/fr";
import { seoMetadata as homeHi } from "./marketing/home/hi";
import { seoMetadata as homeIt } from "./marketing/home/it";
import { seoMetadata as homePt } from "./marketing/home/pt";
import { seoMetadata as homeRu } from "./marketing/home/ru";
import { seoMetadata as homeZh } from "./marketing/home/zh";

// FAQ
import { seoMetadata as faqAr } from "./marketing/faq/faq-ar";
import { seoMetadata as faqCa } from "./marketing/faq/faq-ca";
import { seoMetadata as faqDe } from "./marketing/faq/faq-de";
import { seoMetadata as faqEn } from "./marketing/faq/faq-en";
import { seoMetadata as faqEs } from "./marketing/faq/faq-es";
import { seoMetadata as faqFr } from "./marketing/faq/faq-fr";
import { seoMetadata as faqHi } from "./marketing/faq/faq-hi";
import { seoMetadata as faqIt } from "./marketing/faq/faq-it";
import { seoMetadata as faqPt } from "./marketing/faq/faq-pt";
import { seoMetadata as faqRu } from "./marketing/faq/faq-ru";
import { seoMetadata as faqZh } from "./marketing/faq/faq-zh";

// Pricing
import { seoMetadata as pricingAr } from "./marketing/pricing/pricing-ar";
import { seoMetadata as pricingCa } from "./marketing/pricing/pricing-ca";
import { seoMetadata as pricingDe } from "./marketing/pricing/pricing-de";
import { seoMetadata as pricingEn } from "./marketing/pricing/pricing-en";
import { seoMetadata as pricingEs } from "./marketing/pricing/pricing-es";
import { seoMetadata as pricingFr } from "./marketing/pricing/pricing-fr";
import { seoMetadata as pricingHi } from "./marketing/pricing/pricing-hi";
import { seoMetadata as pricingIt } from "./marketing/pricing/pricing-it";
import { seoMetadata as pricingPt } from "./marketing/pricing/pricing-pt";
import { seoMetadata as pricingRu } from "./marketing/pricing/pricing-ru";
import { seoMetadata as pricingZh } from "./marketing/pricing/pricing-zh";

import type { PageSEO, SitewideSEO } from "./types";

const homeSeoByLocale: Record<string, SitewideSEO> = {
  en: homeEn,
  es: homeEs,
  ca: homeCa,
  zh: homeZh,
  hi: homeHi,
  ar: homeAr,
  fr: homeFr,
  de: homeDe,
  pt: homePt,
  ru: homeRu,
  it: homeIt,
};

const faqSeoByLocale: Record<string, SitewideSEO> = {
  en: faqEn,
  es: faqEs,
  ca: faqCa,
  zh: faqZh,
  hi: faqHi,
  ar: faqAr,
  fr: faqFr,
  de: faqDe,
  pt: faqPt,
  ru: faqRu,
  it: faqIt,
};

const pricingSeoByLocale: Record<string, SitewideSEO> = {
  en: pricingEn,
  es: pricingEs,
  ca: pricingCa,
  zh: pricingZh,
  hi: pricingHi,
  ar: pricingAr,
  fr: pricingFr,
  de: pricingDe,
  pt: pricingPt,
  ru: pricingRu,
  it: pricingIt,
};

/**
 * Get SEO metadata for a given locale, page, and section.
 * Falls back to English if locale is not supported.
 * @param locale - 2-letter locale code (e.g. 'en')
 * @param page - key of SitewideSEO to return (defaults to 'marketing')
 * @param section - section of the site: 'home', 'faq', 'pricing', 'privacy-policy', 'terms-of-service', 'cookie-policy'
 * @returns PageSEO for the requested page and locale
 */
export function getSEOMetadata(
  locale: string,
  page: keyof SitewideSEO = "marketing",
  section:
    | "home"
    | "faq"
    | "pricing"
    | "auth-signup"
    | "auth-login"
    | "privacy-policy"
    | "terms-of-service"
    | "cookie-policy" = "home", // Default to home (root)
): PageSEO {
  const sectionMap: Record<string, Record<string, SitewideSEO>> = {
    home: homeSeoByLocale,
    faq: faqSeoByLocale,
    pricing: pricingSeoByLocale,
    "privacy-policy": privacyPolicySeoByLocale,
    "terms-of-service": termsOfServiceSeoByLocale,
    "cookie-policy": cookiePolicySeoByLocale,
  };

  // Get the section data, fallback to home if missing
  const seoBySection = sectionMap[section] ?? homeSeoByLocale;

  // Get the locale data, fallback to English
  const sitewide = seoBySection[locale] ?? seoBySection["en"];

  return sitewide[page];
}

export * from "./types";
