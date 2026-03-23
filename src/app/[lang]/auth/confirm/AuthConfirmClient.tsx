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
    const nextRaw =
      searchParams.get("next") ?? `/${requestedLang}/builder/onboarding`;
    // Ensure 'next' is always language-prefixed
    const langPrefix = `/${requestedLang}/`;
    let next = nextRaw;
    if (!next.startsWith(langPrefix)) {
      next = next.replace(/^\//, "");
      next = `${langPrefix}${next}`;
    }

    const redirectToNext = () => {
      if (!cancelled) {
        router.replace(next);
      }
    };

    const getExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return session;
    };

    async function completeAuth() {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;
      const code = searchParams.get("code");

      try {
        const existingSession = await getExistingSession();
        if (existingSession) {
          redirectToNext();
          return;
        }

        if (accessToken && refreshToken) {
          setMessage(
            tr(
              translations,
              "auth.confirm.finishing_signin",
              "Finishing sign-in...",
            ),
          );
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          redirectToNext();
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }

          redirectToNext();
          return;
        }

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error) {
            throw error;
          }

          redirectToNext();
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
        const detectedSession = await getExistingSession();
        if (detectedSession) {
          redirectToNext();
          return;
        }

        throw new Error("Missing authentication tokens");
      } catch {
        if (!cancelled) {
          setMessage(
            tr(
              translations,
              "auth.confirm.failure_message",
              "We could not complete your email confirmation.",
            ),
          );
          router.replace(`/${lang}/auth/auth-code-error`);
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        redirectToNext();
      }
    });

    completeAuth();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router, searchParams, supabase, translations]);

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
