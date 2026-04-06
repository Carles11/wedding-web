import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // 1. PHASE ONE: Handle the Root Redirect (/)
  if (pathname === "/") {
    const acceptLang = request.headers.get("accept-language") || "";
    const langCandidates = acceptLang
      .split(",")
      .map((l) => l.split("-")[0].split(";")[0].toLowerCase().trim());

    // Initialize Supabase to check the specific tenant's settings
    const supabase = await createSupabaseSSRClient();

    // Resolve the subdomain from the host (e.g., 'carles.weddweb.com' -> 'carles')
    // Adjust this logic if you use custom domains or different local dev setups
    const subdomain = hostname.split(".")[0];
    const isMarketing =
      hostname === "weddweb.com" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1";

    let allowedLangs: string[] = [...SUPPORTED_LANGUAGES];
    let defaultLang = "en";

    // If it's a tenant site, fetch its specific language constraints
    if (!isMarketing) {
      const { data: site } = await supabase
        .from("sites")
        .select("languages, default_lang")
        .eq("subdomain", subdomain)
        .single();

      if (site) {
        // Use site-specific languages if they exist, otherwise fallback to its default
        allowedLangs =
          site.languages?.length > 0
            ? site.languages
            : [site.default_lang || "en"];
        defaultLang = site.default_lang || "en";
      }
    }

    // Find the first match that the user wants AND the site supports
    const bestLang =
      langCandidates.find((candidate) => allowedLangs.includes(candidate)) ||
      defaultLang;

    return NextResponse.redirect(new URL(`/${bestLang}`, request.url));
  }

  // 2. PHASE TWO: Handle Supabase Session & Protected Routes (Auth/Builder)
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
