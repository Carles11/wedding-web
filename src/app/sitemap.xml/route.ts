// Ensure Vercel/Next.js does not cache this route and respects custom headers
export const dynamic = "force-dynamic";
import { sitemapResponse } from "@/4-shared/lib/seo/sitemapResponse";
import { headers } from "next/headers";
import { GET as getTenantSitemap } from "../sitemap-tenant.xml/route";

const baseUrl = "https://weddweb.com";

export async function GET(request: Request) {
  const host = (await headers()).get("host") || "";

  // Detect if the request is for the main marketing site
  const isMainDomain = host.includes("weddweb.com");

  if (isMainDomain) {
    // Return the Main Index for the SaaS
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>${baseUrl}/sitemap-marketing.xml</loc>
        </sitemap>
        <sitemap>
          <loc>${baseUrl}/sitemap-tenants.xml</loc>
        </sitemap>
      </sitemapindex>`;

    return sitemapResponse(xml);
  }

  // If it's a custom domain (maria-and-pablo.com),
  // we execute the tenant sitemap logic directly.
  return getTenantSitemap(request);
}
