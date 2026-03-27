"use client";

import { MarketingButton } from "@/4-shared/ui/marketing";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_VERSION } from "../config/consents/versions";

// You can pass translations and lang as props for i18n
export function CookiesConsentBanner({
  onAccept,
  translations,
  lang,
  userId,
  userProfile,
}: {
  onAccept?: () => void;
  translations: Record<string, string>;
  lang: string;
  userId?: string | null;
  userProfile?: {
    cookie_consent?: boolean | null;
    cookie_consent_at?: string | null;
    cookie_consent_version?: string | null;
    [key: string]: any;
  } | null;
}) {
  const [visible, setVisible] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localConsent = localStorage.getItem("cookie_consent");
    const localVersion = localStorage.getItem("cookie_consent_version");
    const dbConsent = userProfile?.cookie_consent;
    const dbVersion = userProfile?.cookie_consent_version;

    // If DB says consent is given and version matches, sync localStorage and hide banner
    if (userId && dbConsent && dbVersion === COOKIE_CONSENT_VERSION) {
      if (localConsent !== "true" || localVersion !== COOKIE_CONSENT_VERSION) {
        localStorage.setItem("cookie_consent", "true");
        localStorage.setItem("cookie_consent_version", COOKIE_CONSENT_VERSION);
      }
      setVisible(false);
      setSynced(true);
      return;
    }

    // If localStorage says consent but DB does not, update DB
    if (
      userId &&
      localConsent === "true" &&
      localVersion === COOKIE_CONSENT_VERSION &&
      (!dbConsent || dbVersion !== COOKIE_CONSENT_VERSION)
    ) {
      fetch("/api/updateCookieConsent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consent: true,
          version: COOKIE_CONSENT_VERSION,
        }),
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to sync cookie consent to DB", err);
      });
      setVisible(false);
      setSynced(true);
      return;
    }

    // Otherwise, show banner if not accepted
    setVisible(
      localConsent !== "true" || localVersion !== COOKIE_CONSENT_VERSION,
    );
    setSynced(true);
  }, [userId, userProfile]);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_consent_version", COOKIE_CONSENT_VERSION);
    setVisible(false);
    if (userId) {
      fetch("/api/updateCookieConsent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consent: true,
          version: COOKIE_CONSENT_VERSION,
        }),
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to sync cookie consent to DB", err);
      });
    }
    onAccept?.();
  };

  if (!visible || !synced) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none"
      style={{ background: "none" }}
      aria-live="polite"
    >
      <div
        className="m-4 px-4 py-3 rounded-lg shadow-lg bg-white/95 border border-gray-200 flex flex-col sm:flex-row items-center gap-3 pointer-events-auto"
        style={{ maxWidth: 480 }}
        role="dialog"
        aria-label={
          translations["cookies.banner.aria_label"] || "Cookies consent banner"
        }
      >
        <span className="text-sm text-gray-700 flex-1">
          {translations["cookies.banner.message"] ||
            "We use cookies to improve your experience. By using our site, you accept our use of cookies."}
        </span>

        <MarketingButton
          variant="auth-outline"
          size="sm"
          onClick={handleAccept}
          aria-label={translations["cookies.banner.accept"] || "Accept"}
        >
          {translations["cookies.banner.accept"] || "Accept"}
        </MarketingButton>
      </div>
    </div>
  );
}
