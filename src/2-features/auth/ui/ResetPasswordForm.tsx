"use client";

import { resetPassword } from "@/2-features/auth/api";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { MarketingButton } from "@/4-shared/ui/marketing";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function ResetPasswordForm({ translations }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  // TODO: Replace with actual lang from route context
  const currentLang = "en";

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validatePassword(newPassword)) {
      setError(
        tr(
          translations,
          "auth.common.password_min_length",
          "Password must be at least 8 characters long.",
        ),
      );
      return;
    }

    if (newPassword !== confirmPassword) {
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
      const result = await resetPassword(newPassword);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${currentLang}/auth/login`);
        }, 2000);
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
          <Heading as="h2">
            {tr(
              translations,
              "auth.reset.success_title",
              "Password Reset Successful",
            )}
          </Heading>

          <p className="text-gray-600 mb-6">
            {tr(
              translations,
              "auth.reset.success_message",
              "Your password has been reset. Redirecting to login...",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {tr(translations, "auth.reset.title", "Reset Your Password")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {tr(translations, "auth.reset.new_password", "New Password")}
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="marketing-input"
              placeholder={tr(
                translations,
                "auth.reset.new_password_placeholder",
                "Enter your new password (min 8 characters)",
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
                "auth.reset.confirm_new_password",
                "Confirm New Password",
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
                "auth.reset.confirm_new_password_placeholder",
                "Confirm your new password",
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
              "auth.reset.submitting",
              "Resetting Password...",
            )}
          >
            {tr(translations, "auth.reset.submit", "Reset Password")}
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
      </div>
    </div>
  );
}
