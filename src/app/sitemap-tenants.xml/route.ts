import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { NextResponse } from "next/server";

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
    .select("domains, seo_enabled")
    .eq("seo_enabled", true);

  if (error) {
    return new NextResponse("<error>Failed to fetch tenant sites</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }

  const sitemapEntries = (sites || []).flatMap((site) => {
    if (!Array.isArray(site.domains)) return [];
    return site.domains.map(
      (domain) =>
        // Pointing to the root sitemap.xml of the tenant domain
        `<sitemap><loc>https://${escapeXml(domain)}/sitemap.xml</loc></sitemap>`,
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
