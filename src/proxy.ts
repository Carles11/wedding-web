import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Minimal reliable list of known search engine crawler User-Agents.
 */
const BOT_REGEX =
  /googlebot|bingbot|duckduckbot|slurp|yandexbot|applebot|baiduspider/i;

/**
 * Detect Next.js internal RSC (React Server Component) payload requests.
 * These are made by the client-side router during hydration and navigation.
 * They do NOT carry the original browser/bot UA, so they must be identified
 * by their Next.js-specific headers instead.
 */
function isNextInternalRequest(request: NextRequest): boolean {
  return (
    request.headers.has("rsc") ||
    request.headers.has("next-router-state-tree") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.has("next-router-segment-prefetch")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // PHASE ONE: Handle Root Language Routing (/)
  if (pathname === "/") {
    const host = hostname.toLowerCase().trim();

    const isMarketing =
      host === "weddweb.com" || host === "localhost" || host === "127.0.0.1";

    if (isMarketing) {
      const ua = request.headers.get("user-agent") || "";

      // Let bots through → renders page.tsx SEO content
      if (BOT_REGEX.test(ua)) {
        return NextResponse.next();
      }

      // Let Next.js internal RSC fetches through →
      // prevents client router from being redirected mid-hydration,
      // which was causing Google's JS renderer to end up on /en/
      if (isNextInternalRequest(request)) {
        return NextResponse.next();
      }
    }

    let allowedLangs: string[] = [...SUPPORTED_LANGUAGES];
    let defaultLang = "en";

    // Resolve tenant language preferences for custom domains
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

    // Parse browser language preference
    const acceptLang = request.headers.get("accept-language") || "";
    const langCandidates = acceptLang
      .split(",")
      .map((l) => l.split("-")[0].split(";")[0].toLowerCase().trim());

    // Match to best supported language
    const bestLang =
      langCandidates.find((candidate) => allowedLangs.includes(candidate)) ||
      defaultLang;

    // Edge redirect — before any React rendering, no flash for humans
    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // PHASE TWO: Handle Supabase Session & Protected Dashboard Routes
  return await updateSession(request);
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
