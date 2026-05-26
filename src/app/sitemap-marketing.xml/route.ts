// Ensure Vercel/Next.js does not cache this route and respects custom headers
export const dynamic = "force-dynamic";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { sitemapResponse } from "@/4-shared/lib/seo/sitemapResponse";

const baseUrl = "https://weddweb.com";
function getW3CDate() {
  // Returns YYYY-MM-DD (W3C Datetime)
  return new Date().toISOString().split("T")[0];
}
const priorityMap: Record<string, { p: string; f: string }> = {
  "": { p: "1.0", f: "daily" }, // Home
  pricing: { p: "0.9", f: "weekly" },
  faq: { p: "0.8", f: "weekly" },
  "features/multilingual-wedding-website": { p: "0.85", f: "weekly" },
  "privacy-policy": { p: "0.3", f: "monthly" },
  "terms-of-service": { p: "0.3", f: "monthly" },
  "cookie-policy": { p: "0.3", f: "monthly" },
};
const marketingPages: string[] = [
  "",
  "pricing",
  "faq",
  "privacy-policy",
  "terms-of-service",
  "cookie-policy",
  "features/multilingual-wedding-website",
];
function escapeXml(unsafe: string): string {
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
  const urls = marketingPages
    .flatMap((page: string) => {
      const { p: priority, f: changefreq } = priorityMap[page] || {
        p: "0.5",
        f: "monthly",
      };
      // x-default points to root for homepage, /en/... for inner pages
      const xDefaultHref =
        page === "" ? `${baseUrl}/` : `${baseUrl}/en${page ? `/${page}` : ""}`;
      const alternates = [
        `<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"${xDefaultHref}\" />`,
        ...SUPPORTED_LANGUAGES.map(
          (l: string) =>
            `<xhtml:link rel=\"alternate\" hreflang=\"${l}\" href=\"${baseUrl}/${l}${page ? `/${page}` : ""}\" />`,
        ),
      ].join("");

      return SUPPORTED_LANGUAGES.map((lang: string) => {
        const loc = `${baseUrl}/${lang}${page ? `/${page}` : ""}`;
        return `<url>\n<loc>${escapeXml(loc)}</loc>\n<lastmod>${getW3CDate()}</lastmod>\n<changefreq>${changefreq}</changefreq>\n<priority>${priority}</priority>\n${alternates}\n</url>`;
      });
    })
    .flat();

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n${urls.join("\n")}\n</urlset>`;

  return sitemapResponse(xml);
}
