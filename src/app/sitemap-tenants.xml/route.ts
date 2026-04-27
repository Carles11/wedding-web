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

export async function GET() {
  const supabase = await createSupabaseSSRClient();
  const { data: sites, error } = await supabase
    .from("sites")
    .select("domains, languages, default_lang, last_activity_at , seo_enabled")
    .eq("seo_enabled", true);

  if (error) {
    return sitemapResponse("<error>Failed to fetch tenant sites</error>", 500);
  }

  const urlEntries = (sites || []).flatMap((site) => {
    if (!Array.isArray(site.domains)) return [];
    const siteLangs =
      Array.isArray(site.languages) && site.languages.length > 0
        ? site.languages
        : ["en"];
    const defaultLang = site.default_lang || "en";
    const lastMod = site.last_activity_at
      ? new Date(site.last_activity_at).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return site.domains.flatMap((domain: string) =>
      siteLangs.map((lang: string) => {
        const loc = `https://${escapeXml(domain)}/${lang}`;
        const alternates = [
          `<xhtml:link rel="alternate" hreflang="x-default" href="https://${escapeXml(domain)}/${defaultLang}" />`,
          ...siteLangs.map(
            (l: string) =>
              `<xhtml:link rel="alternate" hreflang="${l}" href="https://${escapeXml(domain)}/${l}" />`,
          ),
        ].join("\n");
        return `<url>\n<loc>${loc}</loc>\n<lastmod>${lastMod}</lastmod>\n<changefreq>weekly</changefreq>\n<priority>1.0</priority>\n${alternates}\n</url>`;
      }),
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join("\n")}\n</urlset>`;

  return sitemapResponse(xml);
}
