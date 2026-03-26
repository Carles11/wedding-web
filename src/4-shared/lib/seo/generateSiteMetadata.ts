import type { Metadata } from "next";

/**
 * Maps simple ISO language codes to the full locale format required by OpenGraph.
 */
function getOGLocale(lang: string): string {
  const localeMap: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
    ca: "ca_ES",
    fr: "fr_FR",
    de: "de_DE",
    it: "it_IT",
    pt: "pt_PT",
    ru: "ru_RU",
    zh: "zh_CN",
    ar: "ar_AR",
    hi: "hi_IN",
  };

  return localeMap[lang] || `${lang}_${lang.toUpperCase()}`;
}

/**
 * Generates SEO metadata for marketing and tenant pages.
 *
 * - Handles dynamic locale mapping for all supported languages.
 * - Manages canonical and hreflang for custom domains vs subdomains.
 */
export function generateSiteMetadata({
  site,
  lang,
  translations,
  baseUrl,
  pageKind = "tenant",
}: {
  site: any;
  lang: string;
  translations: Record<string, any>;
  baseUrl: string;
  pageKind?: "tenant" | "marketing";
}): Metadata {
  const isTenant = pageKind === "tenant";

  // Title and description logic
  const title = isTenant
    ? translations["sections.hero.title"] || site?.title || "Wedding"
    : translations["meta.marketing_title"] || "Welcome | WeddWeb";

  const description = isTenant
    ? translations["sections.hero.description"] || ""
    : translations["meta.marketing_description"] || "";

  // Canonical logic: sanitize protocol and prioritize custom domains
  let canonicalHost = baseUrl.replace(/^https?:\/\//, "");
  if (isTenant && site?.custom_domain) {
    canonicalHost = site.custom_domain;
  }
  const canonicalUrl = `https://${canonicalHost}/${lang}`;

  // Hreflang/alternates logic: Map all languages supported by this specific site
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : [site?.default_lang || "en"];

  let languages: Record<string, string> = {};
  for (const l of availableLangs) {
    languages[l] = `https://${canonicalHost}/${l}`;
  }

  // x-default should point to the site's default language or English
  const defaultLang = site?.default_lang || "en";
  languages["x-default"] = `https://${canonicalHost}/${defaultLang}`;

  const ogImage =
    isTenant && site?.ogImage
      ? site.ogImage
      : `${baseUrl}/assets/og/weddweb-OG.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: isTenant ? title : "WeddWeb",
      locale: getOGLocale(lang), // Dynamic locale mapping
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: pageKind === "marketing" || isTenant, // Ensure marketing/tenants are indexed
      follow: true,
    },
  };
}
