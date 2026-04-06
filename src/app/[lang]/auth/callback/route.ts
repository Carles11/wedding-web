import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Auth callback route handler.
 *
 * Supabase redirects here after email confirmation, OAuth, magic links, etc.
 * Exchanges the auth code for a session and redirects to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin, pathname } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/builder";

  // Extract lang from the URL path segment
  const pathSegments = pathname.split("/").filter(Boolean);
  const requestedLang = pathSegments[0] || "en";
  const buildConfirmUrl = () => {
    const url = new URL(`/${requestedLang}/auth/confirm`, origin);
    if (next && next !== "/builder") {
      url.searchParams.set("next", next);
    }
    return url.toString();
  };

  const buildRedirectUrl = () => {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    // Ensure 'next' is always language-prefixed
    let normalizedNext = next;
    const langPrefix = `/${requestedLang}/`;
    if (!normalizedNext.startsWith(langPrefix)) {
      normalizedNext = normalizedNext.replace(/^\//, "");
      normalizedNext = `${langPrefix}${normalizedNext}`;
    }

    if (isLocalEnv) {
      return `${origin}${normalizedNext}`;
    }

    if (forwardedHost) {
      return `https://${forwardedHost}${normalizedNext}`;
    }

    return `${origin}${normalizedNext}`;
  };

  const supabase = await createSupabaseSSRClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(buildRedirectUrl());
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(buildRedirectUrl());
    }
  }

  // Some Supabase email links deliver tokens in the URL fragment, which the
  // server cannot read. Hand off to the client-side confirm page in that case.
  return NextResponse.redirect(buildConfirmUrl());
}
