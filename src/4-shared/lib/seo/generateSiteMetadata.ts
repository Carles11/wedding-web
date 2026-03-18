import type { Metadata } from "next";

/**
 * Generates SEO metadata for marketing and tenant pages.
 *
 * - For tenant pages, canonical and hreflang always use the current domain (subdomain or custom domain).
 * - For marketing pages, canonical and hreflang use weddweb.com.
 * - Only one domain per tenant is supported (the current host).
 * - All language variants are included in hreflang.
 *
 * @param site - Site object (tenant or marketing)
 * @param lang - Current language
 * @param translations - Translation dictionary
 * @param baseUrl - Current domain (host) for canonical/hreflang
 * @param pageKind - 'tenant' or 'marketing'
 * @returns Metadata object for Next.js
 */
export function generateSiteMetadata({
  site,
  lang,
  translations,
  baseUrl,
  pageKind = "tenant", // or "marketing", etc.
}: {
  site: any;
  lang: string;
  translations: Record<string, any>;
  baseUrl: string;
  pageKind?: "tenant" | "marketing";
}): Metadata {
  // Title and description logic
  const isTenant = pageKind === "tenant";
  const title = isTenant
    ? translations["sections.hero.title"] || site?.name || "Wedding"
    : translations["meta.marketing_title"] || "Welcome";
  const description = isTenant
    ? translations["sections.hero.description"] || ""
    : translations["meta.marketing_description"] || "";

  // Compute languages/hreflang for SEO
  // For tenants: use current domain for all language variants
  // For marketing: use weddweb.com for all language variants
  let languages: Record<string, string> = {};
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : [site?.default_lang || "ca"];
  for (const l of availableLangs) {
    languages[l] =
      pageKind === "tenant"
        ? `${baseUrl}/${l}`
        : `${baseUrl}/${l === "en" ? "" : l}`; // customize per root/lang
  }

  // Return structured metadata for Next.js
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "ca" ? "ca_ES" : lang === "es" ? "es_ES" : "en_US",
      url: `${baseUrl}/${pageKind === "tenant" ? lang : ""}`,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${pageKind === "tenant" ? lang : ""}`,
      languages,
    },
    robots: { index: true, follow: true },
  };
}
