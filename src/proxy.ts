import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Minimal but reliable list of known search engine crawler User-Agents.
 * Intentionally conservative — only major indexing bots that need SEO content.
 */
const BOT_REGEX =
  /googlebot|bingbot|duckduckbot|slurp|yandexbot|applebot|baiduspider/i;

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // PHASE ONE: Handle Root Language Routing (/)
  if (pathname === "/") {
    const host = hostname.toLowerCase().trim();

    const isMarketing =
      host === "weddweb.com" || host === "localhost" || host === "127.0.0.1";

    // For the marketing domain only: let bots fall through to page.tsx,
    // which renders real indexable SEO content at the canonical root URL.
    // Tenant custom domains at "/" always redirect (they have their own SEO pages).
    if (isMarketing) {
      const ua = request.headers.get("user-agent") || "";
      if (BOT_REGEX.test(ua)) {
        return NextResponse.next();
      }
    }

    let allowedLangs: string[] = [...SUPPORTED_LANGUAGES];
    let defaultLang = "en";

    // Safely resolve tenant language preferences for custom domains
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

    // Match browser preference with available languages
    const bestLang =
      langCandidates.find((candidate) => allowedLangs.includes(candidate)) ||
      defaultLang;

    // Fast edge redirect — happens before any React rendering, no flash
    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // PHASE TWO: Handle Supabase Session & Protected Dashboard Routes
  return await updateSession(request);
}

export default proxy;

export const config = {
  matcher: [
    // Match all paths except API routes, static assets, and optimization targets
    "/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)",
  ],
};
