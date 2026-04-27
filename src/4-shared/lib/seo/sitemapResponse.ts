// Shared helper for consistent sitemap response headers
import { NextResponse } from "next/server";

export function sitemapResponse(xml: string, status: number = 200) {
  return new NextResponse(xml, {
    status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
