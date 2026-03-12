"use client";

import { signupWithEmail } from "@/2-features/auth/api";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function SignupForm({ translations }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

  const validatePassword = (password: string) => {
    return password.length >= 8;
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

    if (!validatePassword(password)) {
      setError(
        tr(
          translations,
          "auth.common.password_min_length",
          "Password must be at least 8 characters long.",
        ),
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        tr(
          translations,
          "auth.common.passwords_do_not_match",
          "Passwords do not match.",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signupWithEmail(
        email,
        password,
        fullName || undefined,
        currentLang,
      );
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
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
              "auth.signup.success_message",
              "We&apos;ve sent you a verification link. Please check your email and click the link to activate your account.",
            )}
          </p>
          <Link
            href={`/auth/login${langQuery}`}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
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
          {tr(translations, "auth.signup.title", "Create Your Account")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tr(translations, "auth.signup.full_name", "Full Name")}{" "}
              <span className="text-gray-500">
                {tr(translations, "auth.signup.optional", "(optional)")}
              </span>
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={tr(
                translations,
                "auth.signup.full_name_placeholder",
                "Enter your full name",
              )}
            />
          </div>
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
                "auth.signup.password_placeholder",
                "Enter your password (min 8 characters)",
              )}
              required
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tr(
                translations,
                "auth.signup.confirm_password",
                "Confirm Password",
              )}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={tr(
                translations,
                "auth.signup.confirm_password_placeholder",
                "Confirm your password",
              )}
              required
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? tr(
                  translations,
                  "auth.signup.submitting",
                  "Creating Account...",
                )
              : tr(translations, "auth.common.sign_up", "Sign Up")}
          </button>
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
              "auth.signup.have_account",
              "Already have an account?",
            )}{" "}
            <Link
              href={`/auth/login${langQuery}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {tr(translations, "auth.common.log_in", "Log in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
