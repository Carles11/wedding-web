"use client";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { CheckoutClientProps, CheckoutResponse } from "@/4-shared/types";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type PostPaymentState = "polling" | "confirmed" | "timeout" | "error";

export default function CheckoutClient({
  translations,
  lang,
  initialPlan,
  isSuccess,
  sessionId,
}: CheckoutClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [postPaymentState, setPostPaymentState] =
    useState<PostPaymentState | null>(null);
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>(null);
  const pollRef = useRef(false);

  const validatedLang = isValidLanguage(lang) ? lang : "en";

  // --- Polling logic for post-payment ---
  const pollSubscriptionStatus = useCallback(async () => {
    if (pollRef.current) return;
    pollRef.current = true;
    setPostPaymentState("polling");

    const MAX_ATTEMPTS = 5;
    const INTERVAL_MS = 2000;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch("/api/subscription-status");
        if (res.ok) {
          const data = await res.json();
          if (data.planType && data.planType !== "free") {
            setConfirmedPlan(data.planType);
            setPostPaymentState("confirmed");
            notify.success(
              t(
                translations,
                "checkout.status.payment_success_title",
                "Payment Successful!",
              ),
            );
            return;
          }
        }
      } catch {
        // Network error — continue polling
      }

      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
      }
    }

    // Exhausted all attempts
    setPostPaymentState("timeout");
  }, []);

  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      // 1. Handle Stripe Success Redirect — start polling
      if (isSuccess && sessionId) {
        await pollSubscriptionStatus();
        setLoading(false);
        return;
      }

      // 2. Initiate Stripe Session or Free Plan Completion
      const plan = initialPlan === "premium" ? "premium" : "free";
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
        setErrorCode(data.code ?? null);

        if (data.code === "ALREADY_PREMIUM") {
          const msg = t(
            translations,
            "checkout.info.already_premium",
            "You are already on a premium plan.",
          );
          setError(msg);
        } else if (data.code === "DOWNGRADE_NOT_AVAILABLE") {
          const msg = t(
            translations,
            "checkout.info.downgrade_not_available",
            "Downgrading to Free is not available yet.",
          );
          setError(msg);
        } else if (response.status === 401) {
          const msg = t(
            translations,
            "checkout.error.unauthorized",
            "Please sign in to continue.",
          );
          setError(msg);
        } else {
          const msg =
            data.message ||
            t(
              translations,
              "checkout.error.create_session",
              "Failed to create checkout session",
            );
          setError(msg);
          notify.error(msg);
        }
        setLoading(false);
        return;
      }

      // 3. Handle Free Plan Redirect
      if (data.planType === "free" && data.redirectTo) {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const targetPath = data.redirectTo;
        const langPrefix = `/${validatedLang}`;

        if (targetPath.startsWith(langPrefix)) {
          router.push(targetPath);
        } else {
          const cleanPath = targetPath.startsWith("/")
            ? targetPath
            : `/${targetPath}`;
          router.push(`${langPrefix}${cleanPath}`);
        }
        return;
      }

      // 4. Handle Premium (Stripe) Redirect
      if (data.planType === "premium" && data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Invalid server response");
    } catch (err) {
      console.error("[Checkout] Error:", err);
      const msg = t(
        translations,
        "checkout.error.unexpected",
        "An unexpected error occurred",
      );
      setError(msg);
      notify.error(msg);
      setLoading(false);
    }
  }, [
    isSuccess,
    sessionId,
    initialPlan,
    validatedLang,
    router,
    translations,
    pollSubscriptionStatus,
  ]);

  useEffect(() => {
    handleCheckout();
  }, [handleCheckout]);

  // --- POST-PAYMENT: Confirmed UI ---
  if (postPaymentState === "confirmed") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 dark:from-green-950/30 to-white dark:to-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-green-200 dark:border-green-800">
            <div className="text-5xl mb-4">🎉</div>
            <Heading as="h2" className="text-2xl font-bold text-gray-900 dark:text-gray-100 pb-4">
              {t(translations, "checkout.success.title", "Payment Confirmed!")}
            </Heading>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t(
                translations,
                "checkout.success.plan_activated",
                `Your ${confirmedPlan} plan is now active.`,
              ).replace("{{plan}}", confirmedPlan ?? "premium")}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              {t(
                translations,
                "checkout.success.description",
                "All premium features are now unlocked. Start building your dream wedding website!",
              )}
            </p>
            <button
              onClick={() => router.replace(`/${validatedLang}/builder`)}
              className="w-full px-6 py-3 bg-(--builder-color-primary) text-white rounded-md font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition cursor-pointer"
            >
              {t(
                translations,
                "checkout.action.go_to_builder",
                "Go to Builder →",
              )}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- POST-PAYMENT: Timeout / Fallback UI ---
  if (postPaymentState === "timeout") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 dark:from-amber-950/30 to-white dark:to-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-amber-200 dark:border-amber-800">
            <div className="text-4xl mb-4">✅</div>
            <Heading as="h2" className="text-2xl font-bold text-gray-900 dark:text-gray-100 pb-4">
              {t(translations, "checkout.timeout.title", "Payment Confirmed!")}
            </Heading>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t(
                translations,
                "checkout.timeout.description",
                "Your features are being activated. If this takes more than a minute, please refresh the page or contact support.",
              )}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-(--builder-color-primary) text-white rounded-md font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition cursor-pointer"
              >
                {t(translations, "checkout.action.refresh", "Refresh Page")}
              </button>
              <button
                onClick={() => router.replace(`/${validatedLang}/builder`)}
                className="w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                {t(
                  translations,
                  "checkout.action.go_to_builder",
                  "Go to Builder →",
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- POST-PAYMENT: Polling / Loading UI ---
  if (postPaymentState === "polling") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 dark:from-blue-950/30 to-white dark:to-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <div className="mb-6 inline-block">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
              </div>
            </div>
            <Heading as="h2" className="text-2xl font-bold text-gray-900 dark:text-gray-100 pb-4">
              {t(
                translations,
                "checkout.status.processing_title",
                "Processing...",
              )}
            </Heading>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t(
                translations,
                "checkout.status.confirming_desc",
                "Please wait while we activate your premium features.",
              )}
            </p>
            <CustomLoader
              message={t(
                translations,
                "checkout.status.wait",
                "Please wait, this may take a moment.",
              )}
            />
          </div>
        </div>
      </main>
    );
  }

  // ERROR UI
  if (error) {
    const isAlreadyPremium = errorCode === "ALREADY_PREMIUM";
    const isDowngradeNotAvailable = errorCode === "DOWNGRADE_NOT_AVAILABLE";

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div
            className={`rounded-lg shadow-sm border p-8 ${isAlreadyPremium ? "bg-(--builder-color-primary)/10 border-(--builder-color-primary)/20" : "bg-white dark:bg-gray-800 border-red-200 dark:border-red-800/50"}`}
          >
            <Heading
              as="h2"
              className={`mb-3 ${isAlreadyPremium ? "text-(--builder-color-primary)" : isDowngradeNotAvailable ? "text-amber-700" : "text-red-700"}`}
            >
              {isAlreadyPremium
                ? t(
                    translations,
                    "checkout.info.already_premium_title",
                    "Already Premium",
                  )
                : isDowngradeNotAvailable
                  ? t(
                      translations,
                      "checkout.error.plan_change_not_available",
                      "Plan Change Not Available",
                    )
                  : t(translations, "checkout.error.title", "Checkout Error")}
            </Heading>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push(`/${validatedLang}/builder`)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer"
              >
                {t(
                  translations,
                  "checkout.action.go_to_dashboard",
                  "Go to Dashboard",
                )}
              </button>
              <button
                onClick={() => router.push(`/${validatedLang}/pricing`)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                {t(
                  translations,
                  "checkout.action.back_to_pricing",
                  "Back to Pricing",
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // LOADING / INITIAL PROCESSING UI
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6 inline-block">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>
          </div>

            <Heading as="h2" className="text-2xl font-bold text-gray-900 dark:text-gray-100 pb-4">
              {t(
                translations,
                "checkout.status.confirming_title",
                "Confirming Your Payment...",
              )}
            </Heading>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
            {initialPlan === "free"
              ? t(
                  translations,
                  "checkout.status.setting_up_free",
                  "Setting up your free plan...",
                )
              : t(
                  translations,
                  "checkout.status.preparing_checkout",
                  "Preparing secure checkout...",
                )}
          </p>

          {loading && (
            <CustomLoader
              message={t(
                translations,
                "checkout.status.wait",
                "Please wait, this may take a moment.",
              )}
            />
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            {t(
              translations,
              "checkout.badge.secure_by_stripe",
              "Secure payment processing by Stripe",
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
