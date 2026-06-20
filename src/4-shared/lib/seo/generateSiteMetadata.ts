import { getOGLocale } from "@/4-shared/config/i18n";
import { getPrimaryDomain } from "@/4-shared/lib/seo/getPrimaryDomain";
import type { Metadata } from "next";

/**
 * Generates SEO metadata for marketing and tenant pages.
 * * - Handles dynamic locale mapping for all supported languages.
 * - Manages canonical and hreflang for custom domains vs subdomains.
 * - Enforces robots policy based on site settings or page kind.
 */
const TITLE_SUFFIX: Record<string, string> = {
  en: " Wedding Website | WeddWeb",
  es: " - Sitio Web de Boda | WeddWeb",
  ca: " - Lloc Web de Boda | WeddWeb",
  fr: " - Site de Mariage | WeddWeb",
  de: " - Hochzeitswebsite | WeddWeb",
  it: " - Sito Web di Nozze | WeddWeb",
  pt: " - Site de Casamento | WeddWeb",
  ru: " - Свадебный сайт | WeddWeb",
  zh: " 婚礼网站制作平台 | WeddWeb",
  hi: " की विवाह वेबसाइट | WeddWeb",
  ar: " موقع زفاف ويب | WeddWeb",
};

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
    ? translations["sections.hero.title"] || site?.title || `${site.subdomain}${TITLE_SUFFIX[lang] || TITLE_SUFFIX.en}`
    : translations["meta.marketing_title"] || "Welcome | WeddWeb";

  const description = isTenant
    ? translations["sections.hero.description"] || ""
    : translations["meta.marketing_description"] || "";

  // Canonical logic: use verified custom domain for tenants, raw host otherwise
  const rawHost = baseUrl.replace(/^https?:\/\//, "");
  const canonicalHost = isTenant ? getPrimaryDomain(site, rawHost) : rawHost;
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

  // ROBOTS LOGIC:
  // Marketing pages are always indexed.
  // Tenant pages are indexed only if seo_enabled is true.
  const shouldIndex =
    pageKind === "marketing" || (isTenant && site?.seo_enabled === true);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: isTenant ? title : "WeddWeb",
      locale: getOGLocale(lang),
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
      index: shouldIndex,
      follow: true,
      nocache: !shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: true,
      },
    },
  };
}
