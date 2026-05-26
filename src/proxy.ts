import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // 1. HARD GUARD: Identify the language segment to avoid looping
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
    return await updateSession(request);
  }

  // 2. PHASE ONE: Handle Root Language Routing (/)
  if (pathname === "/") {
    // Crawler bypass: let known bots see the root page
    const ua = (request.headers.get("user-agent") || "").toLowerCase();

    if (
      ua.includes("googlebot") ||
      ua.includes("bingbot") ||
      ua.includes("duckduckbot") ||
      ua.includes("slurp") ||
      ua.includes("yandexbot")
    ) {
      return NextResponse.next();
    }

    // Determine marketing domain
    const host = hostname.toLowerCase().trim();

    const isMarketing =
      host === "weddweb.com" ||
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1");

    // Only redirect on marketing domain root
    if (isMarketing) {
      const acceptLang = request.headers.get("accept-language") || "";

      const langCandidates = acceptLang
        .split(",")
        .map((l) => l.split("-")[0].split(";")[0].toLowerCase().trim());

      const bestLang =
        langCandidates.find((c) => SUPPORTED_LANGUAGES.includes(c as any)) ||
        "en";

      return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
    }
  }

  // 3. PHASE TWO: Handle Supabase Session
  return await updateSession(request);
}

// Required in Next.js 16
export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
