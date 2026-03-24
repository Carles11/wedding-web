import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { NextResponse } from "next/server";

const baseUrl = "https://weddweb.com";
const marketingPages = [
  "",
  "pricing",
  "faq",
  "privacy-policy",
  "terms-of-service",
  "cookie-policy",
  "auth/login",
  "auth/signup",
];

export async function GET() {
  // Fetch all SEO-enabled tenant sites from DB
  const supabase = await createSupabaseSSRClient();
  const { data: sites, error } = await supabase
    .from("sites")
    .select("domains, languages, seo_enabled")
    .eq("seo_enabled", true);

  // Marketing pages
  const today = new Date().toISOString().split("T")[0];
  const marketingUrls = SUPPORTED_LANGUAGES.flatMap((lang) =>
    marketingPages.map((page) => {
      const loc = `${baseUrl}/${lang}${page ? `/${page}` : ""}`;
      const alternates = SUPPORTED_LANGUAGES.map(
        (altLang) =>
          `<xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${page ? `/${page}` : ""}" />`,
      ).join("\n");
      return `<url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        ${alternates}
      </url>`;
    }),
  );

  // Tenant pages (subdomain + custom domain)
  const tenantUrls =
    sites && Array.isArray(sites)
      ? sites.flatMap((site) =>
          Array.isArray(site.domains)
            ? site.domains.flatMap((domain) =>
                (Array.isArray(site.languages)
                  ? site.languages
                  : SUPPORTED_LANGUAGES
                ).flatMap((lang) => {
                  const loc = `https://${domain}/${lang}`;
                  const alternates = SUPPORTED_LANGUAGES.map(
                    (altLang) =>
                      `<xhtml:link rel="alternate" hreflang="${altLang}" href="https://${domain}/${altLang}" />`,
                  ).join("\n");
                  return `<url>
                    <loc>${loc}</loc>
                    <lastmod>${today}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                    ${alternates}
                  </url>`;
                }),
              )
            : [],
        )
      : [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...marketingUrls, ...tenantUrls].join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
