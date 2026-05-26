import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // 1. PHASE ONE: Handle Root Language Routing (/)
  if (pathname === "/") {
    // Crawler bypass: let known bots see the root page for indexing
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    if (
      ua.includes("googlebot") ||
      ua.includes("bingbot") ||
      ua.includes("duckduckbot") ||
      ua.includes("slurp") ||
      ua.includes("yandexbot")
    ) {
      // Return early here so the redirect logic below is never reached
      return NextResponse.next();
    }

    const host = hostname.toLowerCase().trim();
    const isMarketing =
      host === "weddweb.com" || host === "localhost" || host === "127.0.0.1";

    let allowedLangs: string[] = [...SUPPORTED_LANGUAGES];
    let defaultLang = "en";

    // Safely resolve tenant language preferences (handles custom domains correctly)
    if (!isMarketing) {
      const site = await getSiteByDomain(host);
      if (site) {
        allowedLangs =
          site.languages?.length > 0
            ? site.languages
            : [site.default_lang || "en"];
        defaultLang = site.default_lang || "en";
      }
    }

    // Parse guest browser preferences
    const acceptLang = request.headers.get("accept-language") || "";
    const langCandidates = acceptLang
      .split(",")
      .map((l) => l.split("-")[0].split(";")[0].toLowerCase().trim());

    // Match browser request with site allocation
    const bestLang =
      langCandidates.find((candidate) => allowedLangs.includes(candidate)) ||
      defaultLang;

    // Fast HTTP Redirect to the true canonical language instance
    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // 2. PHASE TWO: Handle Supabase Session & Protected Dashboard Routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all paths except API routes, static assets, and optimization targets
    "/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)",
  ],
};
