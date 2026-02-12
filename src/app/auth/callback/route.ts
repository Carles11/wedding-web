import { createClient } from "@/4-shared/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback route handler.
 *
 * Supabase redirects here after email confirmation, OAuth, magic links, etc.
 * Exchanges the auth code for a session and redirects to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/builder";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // Local development: redirect to localhost
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Production: use forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        // Fallback
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Error or no code: redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
