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

// Onboarding
import { seoMetadata as onboardingAr } from "./marketing/onboarding/onboarding-ar";
import { seoMetadata as onboardingCa } from "./marketing/onboarding/onboarding-ca";
import { seoMetadata as onboardingDe } from "./marketing/onboarding/onboarding-de";
import { seoMetadata as onboardingEn } from "./marketing/onboarding/onboarding-en";
import { seoMetadata as onboardingEs } from "./marketing/onboarding/onboarding-es";
import { seoMetadata as onboardingFr } from "./marketing/onboarding/onboarding-fr";
import { seoMetadata as onboardingHi } from "./marketing/onboarding/onboarding-hi";
import { seoMetadata as onboardingIt } from "./marketing/onboarding/onboarding-it";
import { seoMetadata as onboardingPt } from "./marketing/onboarding/onboarding-pt";
import { seoMetadata as onboardingRu } from "./marketing/onboarding/onboarding-ru";
import { seoMetadata as onboardingZh } from "./marketing/onboarding/onboarding-zh";

// Auth Login
import { seoMetadata as authLoginAr } from "./marketing/auth/auth-login-ar";
import { seoMetadata as authLoginCa } from "./marketing/auth/auth-login-ca";
import { seoMetadata as authLoginDe } from "./marketing/auth/auth-login-de";
import { seoMetadata as authLoginEn } from "./marketing/auth/auth-login-en";
import { seoMetadata as authLoginEs } from "./marketing/auth/auth-login-es";
import { seoMetadata as authLoginFr } from "./marketing/auth/auth-login-fr";
import { seoMetadata as authLoginHi } from "./marketing/auth/auth-login-hi";
import { seoMetadata as authLoginIt } from "./marketing/auth/auth-login-it";
import { seoMetadata as authLoginPt } from "./marketing/auth/auth-login-pt";
import { seoMetadata as authLoginRu } from "./marketing/auth/auth-login-ru";
import { seoMetadata as authLoginZh } from "./marketing/auth/auth-login-zh";

// Auth Signup
import { seoMetadata as authSignupAr } from "./marketing/auth/auth-signup-ar";
import { seoMetadata as authSignupCa } from "./marketing/auth/auth-signup-ca";
import { seoMetadata as authSignupDe } from "./marketing/auth/auth-signup-de";
import { seoMetadata as authSignupEn } from "./marketing/auth/auth-signup-en";
import { seoMetadata as authSignupEs } from "./marketing/auth/auth-signup-es";
import { seoMetadata as authSignupFr } from "./marketing/auth/auth-signup-fr";
import { seoMetadata as authSignupHi } from "./marketing/auth/auth-signup-hi";
import { seoMetadata as authSignupIt } from "./marketing/auth/auth-signup-it";
import { seoMetadata as authSignupPt } from "./marketing/auth/auth-signup-pt";
import { seoMetadata as authSignupRu } from "./marketing/auth/auth-signup-ru";
import { seoMetadata as authSignupZh } from "./marketing/auth/auth-signup-zh";

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

const onboardingSeoByLocale: Record<string, SitewideSEO> = {
  en: onboardingEn,
  es: onboardingEs,
  ca: onboardingCa,
  zh: onboardingZh,
  hi: onboardingHi,
  ar: onboardingAr,
  fr: onboardingFr,
  de: onboardingDe,
  pt: onboardingPt,
  ru: onboardingRu,
  it: onboardingIt,
};

const authLoginSeoByLocale: Record<string, SitewideSEO> = {
  en: authLoginEn,
  es: authLoginEs,
  ca: authLoginCa,
  zh: authLoginZh,
  hi: authLoginHi,
  ar: authLoginAr,
  fr: authLoginFr,
  de: authLoginDe,
  pt: authLoginPt,
  ru: authLoginRu,
  it: authLoginIt,
};

const authSignupSeoByLocale: Record<string, SitewideSEO> = {
  en: authSignupEn,
  es: authSignupEs,
  ca: authSignupCa,
  zh: authSignupZh,
  hi: authSignupHi,
  ar: authSignupAr,
  fr: authSignupFr,
  de: authSignupDe,
  pt: authSignupPt,
  ru: authSignupRu,
  it: authSignupIt,
};

/**
 * Get SEO metadata for a given locale, page, and section.
 * Falls back to English if locale is not supported.
 * @param locale - 2-letter locale code (e.g. 'en')
 * @param page - key of SitewideSEO to return (defaults to 'marketing')
 * @param section - section of the site: 'home', 'faq', 'pricing', 'onboarding', 'auth-login', 'auth-signup'
 * @returns PageSEO for the requested page and locale
 */
export function getSEOMetadata(
  locale: string,
  page: keyof SitewideSEO = "marketing",
  section:
    | "home"
    | "faq"
    | "pricing"
    | "onboarding"
    | "auth-login"
    | "auth-signup"
    | "privacy-policy"
    | "terms-of-service"
    | "cookie-policy" = "home",
): PageSEO {
  let seoBySection: Record<string, SitewideSEO>;
  switch (section) {
    case "faq":
      seoBySection = faqSeoByLocale;
      break;
    case "pricing":
      seoBySection = pricingSeoByLocale;
      break;
    case "onboarding":
      seoBySection = onboardingSeoByLocale;
      break;
    case "auth-login":
      seoBySection = authLoginSeoByLocale;
      break;
    case "auth-signup":
      seoBySection = authSignupSeoByLocale;
      break;
    case "privacy-policy":
      seoBySection = privacyPolicySeoByLocale;
      break;
    case "terms-of-service":
      seoBySection = termsOfServiceSeoByLocale;
      break;
    case "cookie-policy":
      seoBySection = cookiePolicySeoByLocale;
      break;
    case "home":
    default:
      seoBySection = homeSeoByLocale;
      break;
  }
  const sitewide = seoBySection[locale] ?? seoBySection["en"];
  return sitewide[page];
}

export * from "./types";
