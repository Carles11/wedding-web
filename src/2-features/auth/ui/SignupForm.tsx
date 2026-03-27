"use client";

import { signupWithEmail } from "@/2-features/auth/api";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { BuilderTextInput } from "@/4-shared/ui/builder/inputs";
import { MarketingButton } from "@/4-shared/ui/marketing";
import { EMAIL_RE, passwordsMatch } from "@/4-shared/utils/validations";
import Link from "next/link";
import React, { useRef, useState } from "react";

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

export default function SignupForm({ translations, lang }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedTermsError, setAcceptedTermsError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [genericError, setGenericError] = useState("");
  // Use lang prop from page
  const notifiedStatus = useRef<string | null>(null);

  // Remove placeholder, use lang prop everywhere

  // Centralized validation
  const TERMS_VERSION = "2026-03-27";
  const validate = () => {
    let hasError = false;
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFullNameError("");
    setGenericError("");
    setAcceptedTermsError("");
    if (!EMAIL_RE.test(email)) {
      setEmailError(
        tr(
          translations,
          "auth.common.email_invalid",
          "Please enter a valid email address.",
        ),
      );
      hasError = true;
    }
    // Granular password validation
    if (password.length < 8) {
      setPasswordError(
        tr(
          translations,
          "auth.common.password_min_length",
          "Password must be at least 8 characters long.",
        ),
      );
      hasError = true;
    } else if (!/[A-Za-z]/.test(password)) {
      setPasswordError(
        tr(
          translations,
          "auth.common.password_letter",
          "Password must contain at least one letter.",
        ),
      );
      hasError = true;
    } else if (!/\d/.test(password)) {
      setPasswordError(
        tr(
          translations,
          "auth.common.password_number",
          "Password must contain at least one number.",
        ),
      );
      hasError = true;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      setConfirmPasswordError(
        tr(
          translations,
          "auth.common.passwords_do_not_match",
          "Passwords do not match.",
        ),
      );
      hasError = true;
    }
    if (!acceptedTerms) {
      setAcceptedTermsError(
        tr(
          translations,
          "auth.signup.accept_terms_error",
          "You must agree to the Privacy Policy and Terms of Service.",
        ),
      );
      hasError = true;
    }
    return hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setGenericError("");
    const hasError = validate();
    if (hasError) return;
    setLoading(true);
    try {
      const result = await signupWithEmail(
        email,
        password,
        fullName || undefined,
        lang,
        acceptedTerms,
        TERMS_VERSION,
      );
      if (result.error) {
        // Try to assign error to input if possible
        if (result.error.toLowerCase().includes("email")) {
          setEmailError(result.error);
        } else if (result.error.toLowerCase().includes("password")) {
          setPasswordError(result.error);
        } else {
          setGenericError(result.error);
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setGenericError(
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
              "We've sent you a verification link. Please check your email and click the link to activate your account.",
            )}
          </p>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {tr(
                translations,
                "auth.signup.have_account",
                "Already have an account?",
              )}{" "}
              <Link
                href={`/${lang}/auth/login`}
                className="font-medium marketing-link"
              >
                {tr(translations, "auth.common.log_in", "Log in")}
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${lang}`} className="text-sm marketing-link">
              {tr(translations, "auth.common.back_to_home", "Back to home")}
            </Link>
          </div>
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
          <BuilderTextInput
            label={
              tr(translations, "auth.signup.full_name", "Full Name") +
              " " +
              tr(translations, "auth.signup.optional", "(optional)")
            }
            value={fullName}
            onChange={setFullName}
            placeholder={tr(
              translations,
              "auth.signup.full_name_placeholder",
              "Enter your full name",
            )}
            autoComplete="name"
            error={fullNameError}
          />
          <BuilderTextInput
            label={tr(translations, "auth.common.email", "Email")}
            value={email}
            onChange={setEmail}
            type="email"
            placeholder={tr(
              translations,
              "auth.common.email_placeholder",
              "Enter your email",
            )}
            autoComplete="email"
            error={emailError}
          />
          <BuilderTextInput
            label={tr(translations, "auth.common.password", "Password")}
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete="new-password"
            showPasswordToggle
            placeholder={tr(
              translations,
              "auth.signup.password_placeholder",
              "Enter your password (min 8 characters)",
            )}
            error={passwordError}
          />
          <BuilderTextInput
            label={tr(
              translations,
              "auth.signup.confirm_password",
              "Confirm Password",
            )}
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            autoComplete="new-password"
            showPasswordToggle
            placeholder={tr(
              translations,
              "auth.signup.confirm_password_placeholder",
              "Confirm your password",
            )}
            error={confirmPasswordError}
          />
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
          <div className="flex items-center mt-2">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mr-2 h-4 w-4 border-gray-300 rounded"
              required
            />
            <label
              htmlFor="accept-terms"
              className="text-sm text-gray-700 select-none"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: interpolate(
                    tr(
                      translations,
                      "auth.signup.accept_terms_label",
                      "I agree to the weddweb.com {privacy} and {terms}.",
                    ),
                    {
                      privacy: `<a href='/${lang}/privacy-policy' target='_blank' class='underline text-primary'>${tr(translations, "auth.signup.privacy_policy", "Privacy Policy")}</a>`,
                      terms: `<a href='/${lang}/terms-of-service' target='_blank' class='underline text-primary'>${tr(translations, "auth.signup.terms_of_service", "Terms of Service")}</a>`,
                    },
                  ),
                }}
              />
            </label>
          </div>
          {acceptedTermsError && (
            <p
              className="text-xs text-(--builder-color-danger) mt-1"
              role="alert"
            >
              {acceptedTermsError}
            </p>
          )}
        </form>
        {genericError && (
          <p
            id="error-message"
            className="mt-4 text-sm text-(--builder-color-danger) text-center"
            role="alert"
          >
            {genericError}
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
              href={`/${lang}/auth/login`}
              className="font-medium marketing-link"
            >
              {tr(translations, "auth.common.log_in", "Log in")}
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href={`/${lang}`} className="text-sm marketing-link">
            {tr(translations, "auth.common.back_to_home", "Back to home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
