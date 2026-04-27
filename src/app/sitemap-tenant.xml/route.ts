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

export async function GET(request: Request) {
  const host = request.headers.get("host") || "";
  const supabase = await createSupabaseSSRClient();
  const { data: site, error } = await supabase
    .from("sites")
    .select("languages, default_lang, updated_at, seo_enabled")
    .contains("domains", [host])
    .eq("seo_enabled", true)
    .single();

  if (error || !site) {
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
      `<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"https://${escapeXml(host)}/${defaultLang}\" />`,
      ...siteLangs.map(
        (l) =>
          `<xhtml:link rel=\"alternate\" hreflang=\"${l}\" href=\"https://${escapeXml(host)}/${l}\" />`,
      ),
    ].join("");
    return `<url>\n<loc>${loc}</loc>\n<lastmod>${lastMod}</lastmod>\n<changefreq>weekly</changefreq>\n<priority>1.0</priority>\n${alternates}\n</url>`;
  });

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n${urls.join("\n")}\n</urlset>`;

  return sitemapResponse(xml);
}
