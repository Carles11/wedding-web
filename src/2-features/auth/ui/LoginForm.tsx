"use client";

import { loginWithEmail, resendVerificationEmail } from "@/2-features/auth/api";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  translations: Record<string, string>;
};

function tr(
  translations: Record<string, string>,
  key: string,
  fallback: string,
) {
  return translations[key] ?? fallback;
}

export default function LoginForm({ translations }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const notifiedStatus = useRef<string | null>(null);
  const requestedLang = searchParams.get("lang") ?? undefined;
  const currentLang = isValidLanguage(requestedLang) ? requestedLang : "en";
  const langQuery = `?lang=${encodeURIComponent(currentLang)}`;

  useEffect(() => {
    const status = searchParams.get("status");
    if (!status || notifiedStatus.current === status) return;

    notifiedStatus.current = status;

    if (status === "verify-email") {
      notify.info(
        tr(
          translations,
          "auth.common.verify_email_required",
          "Please verify your email before accessing the builder. Check your inbox for the confirmation link.",
        ),
      );
    }
  }, [searchParams, translations]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isUnverifiedEmailError = (message: string) =>
    /unverified email|email not confirmed|confirm your email/i.test(message);

  const handleResendVerification = async () => {
    if (!validateEmail(email)) {
      setError(
        tr(
          translations,
          "auth.login.enter_email_for_resend",
          "Please enter your email above to resend verification.",
        ),
      );
      return;
    }

    setResendingVerification(true);
    try {
      const result = await resendVerificationEmail(email, currentLang);
      if (result.error) {
        notify.error(result.error);
        return;
      }

      notify.success(
        tr(
          translations,
          "auth.common.verification_sent",
          "Verification email sent. Please check your inbox.",
        ),
      );
    } catch {
      notify.error(
        tr(
          translations,
          "auth.common.verification_resend_failed",
          "Could not resend verification email. Please try again.",
        ),
      );
    } finally {
      setResendingVerification(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateEmail(email)) {
      setError(
        tr(
          translations,
          "auth.common.email_invalid",
          "Please enter a valid email address.",
        ),
      );
      return;
    }

    if (!password.trim()) {
      setError(
        tr(
          translations,
          "auth.common.password_required",
          "Password is required.",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/builder${langQuery}`);
        }, 1000);
      }
    } catch {
      setError(
        tr(
          translations,
          "auth.common.unexpected_error",
          "An unexpected error occurred. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {tr(translations, "auth.login.title", "Login to Your Account")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tr(translations, "auth.common.email", "Email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={tr(
                translations,
                "auth.common.email_placeholder",
                "Enter your email",
              )}
              required
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tr(translations, "auth.common.password", "Password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={tr(
                translations,
                "auth.login.password_placeholder",
                "Enter your password",
              )}
              required
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <div className="text-right">
            <Link
              href={`/auth/forgot-password${langQuery}`}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {tr(
                translations,
                "auth.login.forgot_password",
                "Forgot password?",
              )}
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? tr(translations, "auth.login.submitting", "Logging in...")
              : tr(translations, "auth.common.log_in", "Login")}
          </button>
        </form>
        {error && (
          <div className="mt-4">
            <p
              id="error-message"
              className="text-sm text-red-600 text-center"
              role="alert"
            >
              {error}
            </p>
            {isUnverifiedEmailError(error) && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="mt-3 w-full py-2 px-4 border border-blue-300 text-blue-700 font-medium rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingVerification
                  ? tr(
                      translations,
                      "auth.common.resending_verification",
                      "Resending verification...",
                    )
                  : tr(
                      translations,
                      "auth.common.resend_verification",
                      "Resend verification email",
                    )}
              </button>
            )}
          </div>
        )}
        {success && (
          <p className="mt-4 text-sm text-green-600 text-center">
            {tr(
              translations,
              "auth.login.success_redirecting",
              "Login successful! Redirecting...",
            )}
          </p>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {tr(
              translations,
              "auth.login.no_account",
              "Don&apos;t have an account?",
            )}{" "}
            <Link
              href={`/auth/signup${langQuery}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {tr(translations, "auth.common.sign_up", "Sign up")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
