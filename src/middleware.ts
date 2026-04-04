import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PHASE ONE: Handle the Root Redirect (/)
  // This must come BEFORE Supabase logic to ensure fast routing
  if (pathname === "/") {
    const acceptLang = request.headers.get("accept-language") || "en";
    const bestLang =
      SUPPORTED_LANGUAGES.find((l) => acceptLang.includes(l)) || "en";

    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // 2. PHASE TWO: Handle Supabase Session & Protected Routes
  // This refreshes the session and handles /auth or /builder redirects
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon.ico, api, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
