// Ensure Vercel/Next.js does not cache this route and respects custom headers
export const dynamic = "force-dynamic";
import { sitemapResponse } from "@/4-shared/lib/seo/sitemapResponse";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'\"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

function normalizeHost(host: string): string {
  let h = host.trim().toLowerCase();
  // Remove www. if present
  if (h.startsWith("www.")) h = h.slice(4);
  return h;
}

function getSubdomainFromHost(host: string): string | null {
  // e.g., inesundcarles.weddweb.com -> inesundcarles
  const mainDomain = "weddweb.com";
  if (host.endsWith(mainDomain)) {
    const parts = host.split(".");
    // classic "foo.weddweb.com"
    if (parts.length === 3 && parts[1] === "weddweb" && parts[2] === "com") {
      return parts[0];
    }
  }
  return null;
}

export async function GET(request: Request) {
  const host = request.headers.get("host")?.toLowerCase() || "";
  const normalizedHost = normalizeHost(host);
  const supabase = await createSupabaseSSRClient();

  // Fetch all SEO tenants up front
  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select(
      "domains, subdomain, languages, default_lang, updated_at, seo_enabled",
    )
    .eq("seo_enabled", true);

  console.log("raw host:", host);
  console.log("normalized host:", normalizedHost);
  console.log(
    "Supabase sites:",
    sites &&
      sites.map((s) => ({
        domains: s.domains,
        subdomain: s.subdomain,
      })),
  );

  if (sites) {
    for (const s of sites) {
      console.log(
        "Checking tenant:",
        s.subdomain,
        s.domains.map((d: string) => normalizeHost(d)),
      );
    }
  }

  if (!sites || sites.length === 0) {
    return sitemapResponse("<error>No tenants found</error>", 404);
  }

  // Try exact custom domain match (normalized)
  let site = sites.find(
    (s) =>
      Array.isArray(s.domains) &&
      s.domains.map((d: string) => normalizeHost(d)).includes(normalizedHost),
  );

  // Fallback: try subdomain match
  if (!site) {
    const subdomain = getSubdomainFromHost(normalizedHost);
    if (subdomain) {
      site = sites.find(
        (s) =>
          typeof s.subdomain === "string" &&
          s.subdomain.toLowerCase() === subdomain,
      );
    }
  }

  if (!site) {
    return sitemapResponse("<error>Tenant not found</error>", 404);
  }

  const siteLangs =
    Array.isArray(site.languages) && site.languages.length > 0
      ? site.languages
      : ["en"];
  const lastMod = site.updated_at
    ? new Date(site.updated_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  // x-default uses the site's actual default language (matches <head> hreflang)
  const defaultLang = site.default_lang || "en";

  // Only generate URLs for enabled languages, with x-default always present
  const urls = siteLangs.map((lang) => {
    const loc = `https://${escapeXml(host)}/${lang}`;
    const alternates = [
      `<xhtml:link rel="alternate" hreflang="x-default" href="https://${escapeXml(host)}/${defaultLang}" />`,
      ...siteLangs.map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="https://${escapeXml(host)}/${l}" />`,
      ),
    ].join("");
    return `<url>
<loc>${loc}</loc>
<lastmod>${lastMod}</lastmod>
<changefreq>weekly</changefreq>
<priority>1.0</priority>
${alternates}
</url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return sitemapResponse(xml);
}
