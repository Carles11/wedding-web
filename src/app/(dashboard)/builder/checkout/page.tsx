"use client";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  const planRaw = params.get("plan");
  const langRaw = params.get("lang");
  const successParam = params.get("success");
  const sessionIdParam = params.get("session_id");

  const lang = isValidLanguage(langRaw ?? undefined) ? langRaw : "en";
  const plan = planRaw === "free" || planRaw === "premium" ? planRaw : "free";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    handleCheckout();
  }, []);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      // Success redirect from Stripe
      if (successParam === "true" && sessionIdParam) {
        // TODO: Verify payment status with our API before redirecting
        // For now, just show success and redirect to builder
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(`/builder?lang=${lang}`);
        return;
      }

      // Normal checkout flow
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: plan,
          language: lang,
        }),
      });

      const data: CheckoutResponse = await response.json();

      if (!data.success) {
        if (data.code === "ALREADY_PREMIUM") {
          notify.info("You are already premium.", {
            toastId: "checkout-already-premium",
          });
          router.replace(`/marketing/pricing?lang=${lang}`);
          return;
        }

        setErrorCode(data.code ?? null);
        setError(data.message || "Failed to create checkout session");
        return;
      }

      // Free plan: redirect directly to builder
      if (data.planType === "free" && data.redirectTo) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        router.push(data.redirectTo);
        return;
      }

      // Premium plan: redirect to Stripe checkout
      if (data.planType === "premium" && data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Unexpected response from server");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
            <Heading
              as="h2"
              className="text-2xl font-semibold text-red-700 mb-3"
            >
              {errorCode === "DOWNGRADE_NOT_AVAILABLE"
                ? "Plan Change Not Available"
                : "Checkout Error"}
            </Heading>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push(`/marketing/pricing?lang=${lang}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          {/* Loading spinner */}
          <div className="mb-6 inline-block">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>
          </div>

          <Heading as="h2" className="text-2xl font-bold text-gray-900 mb-2">
            {successParam === "true" ? "Payment Successful!" : "Processing..."}
          </Heading>

          <p className="text-gray-600 mb-6">
            {successParam === "true"
              ? "Your payment has been processed successfully. Redirecting to your site..."
              : plan === "free"
                ? "Setting up your free plan..."
                : "Preparing secure checkout..."}
          </p>

          {loading && (
            <p className="text-sm text-gray-500">
              Please wait, this may take a moment.
            </p>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span> Secure payment processing by Stripe
          </p>
        </div>
      </div>
    </main>
  );
}
