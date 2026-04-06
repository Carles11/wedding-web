"use client";

import { createClient } from "@/4-shared/lib/supabase/client";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  translations: Record<string, string>;
  lang: string;
};

function tr(
  translations: Record<string, string>,
  key: string,
  fallback: string,
) {
  return translations[key] ?? fallback;
}

export default function AuthConfirmClient({ translations, lang }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [message, setMessage] = useState(
    tr(
      translations,
      "auth.confirm.initial_message",
      "Confirming your email...",
    ),
  );

  useEffect(() => {
    let cancelled = false;
    const requestedLang = lang;

    // 1. ROBUST DECODE: Handle double-encoded slashes from the Edge Function
    const rawParam = searchParams.get("next");
    let nextRaw = rawParam
      ? decodeURIComponent(rawParam)
      : `/${requestedLang}/builder/onboarding`;

    // If it's still encoded (contains %2F), decode one more time
    if (nextRaw.includes("%")) {
      nextRaw = decodeURIComponent(nextRaw);
    }

    const langPrefix = `/${requestedLang}/`;
    let next = nextRaw;
    if (!next.startsWith(langPrefix)) {
      next = next.replace(/^\//, "");
      next = `${langPrefix}${next}`;
    }

    // 2. HARD REDIRECT: window.location.href ensures Middleware
    // detects the new session/cookies after the email change.
    const redirectToNext = () => {
      if (!cancelled) {
        window.location.href = next;
      }
    };

    const getExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    };

    async function completeAuth() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;
      const code = searchParams.get("code");

      try {
        // --- THE FIX: FORCED VERIFICATION ---
        // We only check for an existing session and skip if NO verification tokens are present.
        // If we HAVE a token, we must run the verification even if logged in (common for email changes).
        if (!tokenHash && !code) {
          const existingSession = await getExistingSession();
          if (existingSession) {
            redirectToNext();
            return;
          }
        }

        // Logic for PKCE (code)
        if (code) {
          setMessage(
            tr(
              translations,
              "auth.confirm.finishing_signin",
              "Verifying code...",
            ),
          );
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          redirectToNext();
          return;
        }

        // Logic for OTP / Recovery / Email Change (token_hash)
        if (tokenHash && type) {
          setMessage(
            tr(
              translations,
              "auth.confirm.finishing_signin",
              "Finalizing change...",
            ),
          );

          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });

          if (error) throw error;

          // Verification successful - redirecting will now show the new email
          redirectToNext();
          return;
        }

        // If we reach here with no tokens and no session, wait briefly then check again
        await new Promise((resolve) => setTimeout(resolve, 500));
        const finalCheck = await getExistingSession();
        if (finalCheck) {
          redirectToNext();
        } else {
          throw new Error("Missing authentication tokens");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Auth Confirmation Error:", err);
          setMessage(
            tr(
              translations,
              "auth.confirm.failure_message",
              "We could not complete your email confirmation.",
            ),
          );
          // Only redirect to error if verification actually failed
          router.replace(`/${lang}/auth/auth-code-error`);
        }
      }
    }

    completeAuth();

    return () => {
      cancelled = true;
    };
  }, [lang, router, searchParams, supabase, translations]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <Heading as="h2">
          {tr(translations, "auth.confirm.title", "Confirming Access")}
        </Heading>

        <p className="mt-3 text-gray-600">{message}</p>
      </div>
    </main>
  );
}
