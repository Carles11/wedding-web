"use client";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CheckoutResponse {
  success: boolean;
  code?: string;
  planType: string;
  sessionId?: string;
  url?: string;
  redirectTo?: string;
  message?: string;
}

function tr(t: Record<string, string>, key: string, fallback: string) {
  return t[key] ?? fallback;
}

export default function CheckoutClient({
  t,
  lang,
}: {
  t: Record<string, string>;
  lang: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const planRaw = params.get("plan");
  const successParam = params.get("success");
  const sessionIdParam = params.get("session_id");

  const validatedLang = isValidLanguage(lang) ? lang : "en";
  const plan = planRaw === "free" || planRaw === "premium" ? planRaw : "free";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    handleCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      // Success redirect from Stripe
      if (successParam === "true" && sessionIdParam) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(`/${validatedLang}/builder`);
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: plan,
          language: validatedLang,
        }),
      });

      const data: CheckoutResponse = await response.json();

      if (!data.success) {
        if (data.code === "ALREADY_PREMIUM") {
          setErrorCode(data.code);
          setError(
            tr(
              t,
              "checkout.info.already_premium",
              "You are already on a premium plan.",
            ),
          );
          return;
        }

        if (data.code === "DOWNGRADE_NOT_AVAILABLE") {
          setErrorCode(data.code);
          setError(
            tr(
              t,
              "checkout.info.downgrade_not_available",
              "Downgrading from your current paid plan to Free is not available yet. Your current plan remains active.",
            ),
          );
          return;
        }

        if (response.status === 401) {
          setError(
            tr(t, "checkout.error.unauthorized", "Please sign in to continue."),
          );
          return;
        }

        if (response.status === 400) {
          setError(
            tr(
              t,
              "checkout.error.invalid_request",
              "Invalid checkout request.",
            ),
          );
          return;
        }

        if (response.status >= 500) {
          setError(
            tr(t, "checkout.error.server", "Server error. Please try again."),
          );
          return;
        }

        setErrorCode(data.code ?? null);
        setError(
          tr(
            t,
            "checkout.error.create_session",
            "Failed to create checkout session",
          ),
        );
        return;
      }

      if (data.planType === "free" && data.redirectTo) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Ensure redirectTo is always language-prefixed
        let redirectTo = data.redirectTo;
        const langPrefix = `/${validatedLang}/`;
        if (!redirectTo.startsWith(langPrefix)) {
          redirectTo = redirectTo.replace(/^\//, "");
          redirectTo = `${langPrefix}${redirectTo}`;
        }
        router.push(redirectTo);
        return;
      }

      if (data.planType === "premium" && data.url) {
        window.location.href = data.url;
        return;
      }

      setError(
        tr(t, "checkout.error.unexpected", "Unexpected response from server"),
      );
    } catch {
      setError(
        tr(t, "checkout.error.unexpected", "An unexpected error occurred"),
      );
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    const isAlreadyPremium = errorCode === "ALREADY_PREMIUM";
    const isDowngradeNotAvailable = errorCode === "DOWNGRADE_NOT_AVAILABLE";

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div
            className={`rounded-lg shadow-sm border p-8 ${
              isAlreadyPremium
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-red-200"
            }`}
          >
            <Heading
              as="h2"
              className={` mb-3 ${
                isAlreadyPremium
                  ? "text-blue-700"
                  : isDowngradeNotAvailable
                    ? "text-amber-700"
                    : "text-red-700"
              }`}
            >
              {isAlreadyPremium
                ? tr(
                    t,
                    "checkout.info.already_premium_title",
                    "Already Premium",
                  )
                : isDowngradeNotAvailable
                  ? tr(
                      t,
                      "checkout.error.plan_change_not_available",
                      "Plan Change Not Availabless",
                    )
                  : tr(t, "checkout.error.title", "Checkout Error")}
            </Heading>
            <p className="text-gray-600 mb-8">{error}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/${validatedLang}/builder`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
              >
                {tr(t, "checkout.action.go_to_dashboard", "Go to Dashboard")}
              </button>
              <button
                onClick={() => router.push(`/${validatedLang}/pricing`)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition"
              >
                {tr(t, "checkout.action.back_to_pricing", "Back to Pricing")}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <div className="mb-6 inline-block">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>
          </div>

          <Heading as="h2" className="text-2xl font-bold text-gray-900 mb-2">
            {successParam === "true"
              ? tr(
                  t,
                  "checkout.status.payment_success_title",
                  "Payment Successful!",
                )
              : tr(t, "checkout.status.processing_title", "Processing...")}
          </Heading>

          <p className="text-gray-600 mb-6">
            {successParam === "true"
              ? tr(
                  t,
                  "checkout.status.payment_success_desc",
                  "Your payment has been processed successfully. Redirecting to your site...",
                )
              : plan === "free"
                ? tr(
                    t,
                    "checkout.status.setting_up_free",
                    "Setting up your free plan...",
                  )
                : tr(
                    t,
                    "checkout.status.preparing_checkout",
                    "Preparing secure checkout...",
                  )}
          </p>

          {loading && (
            <p className="text-sm text-gray-500">
              {tr(
                t,
                "checkout.status.wait",
                "Please wait, this may take a moment.",
              )}
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span aria-hidden>\ud83d\udd12</span>
            {tr(
              t,
              "checkout.badge.secure_by_stripe",
              "Secure payment processing by Stripe",
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
