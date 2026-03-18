"use client";

import { sendPasswordReset } from "@/2-features/auth/api";
import { MarketingButton } from "@/4-shared/ui/marketing";
import Link from "next/link";
import { useState } from "react";

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

export default function ForgotPasswordForm({ translations, lang }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const currentLang = lang;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    setLoading(true);
    try {
      const result = await sendPasswordReset(email, currentLang);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
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

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {tr(translations, "auth.common.check_email", "Check Your Email")}
          </h2>
          <p className="text-gray-600 mb-6">
            {tr(
              translations,
              "auth.forgot.success_message",
              "We&apos;ve sent you a password reset link. Please check your email and click the link to reset your password.",
            )}
          </p>
          <Link href={`/${currentLang}/auth/login`} className="marketing-link">
            {tr(translations, "auth.common.return_to_login", "Return to Login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {tr(translations, "auth.forgot.title", "Reset Your Password")}
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
              className="marketing-input"
              placeholder={tr(
                translations,
                "auth.common.email_placeholder",
                "Enter your email",
              )}
              required
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <MarketingButton
            type="submit"
            variant="auth"
            fullWidth
            loading={loading}
            loadingLabel={tr(
              translations,
              "auth.forgot.submitting",
              "Sending Reset Link...",
            )}
          >
            {tr(translations, "auth.forgot.submit", "Send Reset Link")}
          </MarketingButton>
        </form>
        {error && (
          <p
            id="error-message"
            className="mt-4 text-sm text-red-600 text-center"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {tr(
              translations,
              "auth.forgot.remember_password",
              "Remember your password?",
            )}{" "}
            <Link
              href={`/${currentLang}/auth/login`}
              className="font-medium marketing-link"
            >
              {tr(translations, "auth.common.log_in", "Log in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
