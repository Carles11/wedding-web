import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh Supabase auth sessions and protect authenticated routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // Only protect authenticated app routes
  const isProtectedRoute = /^\/[a-z]{2}\/(builder|dashboard)(\/|$)/.test(
    pathname,
  );

  // Public routes do not require auth checks
  if (!isProtectedRoute) {
    return supabaseResponse;
  }

  // IMPORTANT:
  // Avoid inserting logic between createServerClient()
  // and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to localized login
  if (!user) {
    const lang = pathname.split("/")[1] || "en";

    const url = request.nextUrl.clone();

    url.pathname = `/${lang}/auth/login`;

    url.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
