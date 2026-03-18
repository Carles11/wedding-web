"use client";

import { signupWithEmail } from "@/2-features/auth/api";
import { MarketingButton } from "@/4-shared/ui/marketing";
import Link from "next/link";
import { useRef, useState } from "react";

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
  // TODO: Replace with actual lang from route context
  const currentLang = "en";
  const notifiedStatus = useRef<string | null>(null);

  // ...existing code...

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
          <Link href={`/${currentLang}/auth/login`} className="marketing-link">
            {tr(translations, "auth.common.return_to_login", "Return to Login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {tr(translations, "auth.signup.title", "Create Your Account")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
              className="marketing-input"
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
              className="marketing-input"
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
              className="marketing-input"
              placeholder={tr(
                translations,
                "auth.signup.confirm_password_placeholder",
                "Confirm your password",
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
              "auth.signup.submitting",
              "Creating Account...",
            )}
          >
            {tr(translations, "auth.common.sign_up", "Sign Up")}
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
              "auth.signup.have_account",
              "Already have an account?",
            )}{" "}
            <Link
              href={`/${currentLang}/auth/login`}
              className="font-medium marketing-link"
            >
              {tr(translations, "auth.common.log_in", "Log in")}
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href={`/${currentLang}`} className="text-sm marketing-link">
            {tr(translations, "auth.common.back_to_home", "Back to home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
