import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { NextResponse } from "next/server";

const baseUrl = "https://weddweb.com";
const marketingPages = ["", "pricing", "auth/login", "auth/signup"];

export async function GET() {
  // Fetch all SEO-enabled tenant sites from DB
  const supabase = await createSupabaseSSRClient();
  const { data: sites, error } = await supabase
    .from("sites")
    .select("domains, languages, seo_enabled")
    .eq("seo_enabled", true);

  // Marketing pages
  const marketingUrls = SUPPORTED_LANGUAGES.flatMap((lang) =>
    marketingPages.map(
      (page) =>
        `<url>
          <loc>${baseUrl}/${lang}${page ? `/${page}` : ""}</loc>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>`,
    ),
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
                ).map(
                  (lang) =>
                    `<url>
                      <loc>https://${domain}/${lang}</loc>
                      <changefreq>weekly</changefreq>
                      <priority>0.8</priority>
                    </url>`,
                ),
              )
            : [],
        )
      : [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...marketingUrls, ...tenantUrls].join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
