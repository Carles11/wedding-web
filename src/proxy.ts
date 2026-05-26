import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const BOT_REGEX =
  /googlebot|bingbot|duckduckbot|slurp|yandexbot|applebot|baiduspider/i;

function isNextInternalRequest(request: NextRequest): boolean {
  return (
    request.headers.has("rsc") ||
    request.headers.has("next-router-state-tree") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.has("next-router-segment-prefetch")
  );
}

/**
 * Extract the best language from a pathname.
 * Returns "en" for the root path or any unrecognised segment.
 */
function extractLang(pathname: string): string {
  const segment = pathname.split("/")[1] ?? "";
  return SUPPORTED_LANGUAGES.includes(
    segment as (typeof SUPPORTED_LANGUAGES)[number],
  )
    ? segment
    : "en";
}

/**
 * Build a new NextRequest that forwards all original headers plus
 * x-detected-lang so the root layout can set <html lang="…"> correctly.
 * Safe for GET requests (no body). POST/mutations never hit the root page.
 */
function withLangHeader(request: NextRequest, lang: string): NextRequest {
  const headers = new Headers(request.headers);
  headers.set("x-detected-lang", lang);
  return new NextRequest(request.url, { headers });
}

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ─── PHASE ONE: Root Language Routing (/) ────────────────────────────────
  if (pathname === "/") {
    const host = hostname.toLowerCase().trim();

    const isMarketing =
      host === "weddweb.com" || host === "localhost" || host === "127.0.0.1";

    if (isMarketing) {
      const ua = request.headers.get("user-agent") || "";

      // Bots: fall through to page.tsx which renders indexable SEO content
      if (BOT_REGEX.test(ua)) {
        return NextResponse.next({
          request: { headers: withLangHeader(request, "en").headers },
        });
      }

      // Next.js RSC fetches during hydration: fall through so the client
      // router is not redirected mid-render (fixes Google WRS canonical issue)
      if (isNextInternalRequest(request)) {
        return NextResponse.next({
          request: { headers: withLangHeader(request, "en").headers },
        });
      }
    }

    let allowedLangs: string[] = [...SUPPORTED_LANGUAGES];
    let defaultLang = "en";

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

    const acceptLang = request.headers.get("accept-language") || "";
    const langCandidates = acceptLang
      .split(",")
      .map((l) => l.split("-")[0].split(";")[0].toLowerCase().trim());

    const bestLang =
      langCandidates.find((c) => allowedLangs.includes(c)) || defaultLang;

    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // ─── PHASE TWO: Supabase Session + Protected Routes ──────────────────────
  // Forward the detected lang so root layout can set <html lang="…"> correctly
  const lang = extractLang(pathname);
  return updateSession(withLangHeader(request, lang));
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
