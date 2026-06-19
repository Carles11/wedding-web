"use client";

import { MarketingButton } from "@/4-shared/ui/marketing";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_VERSION } from "../config/consents/versions";

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

  // Helper to notify Google Analytics of the consent change
  const notifyGA4 = (granted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      // 1. Update the permission
      (window as any).gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
      });

      // 2. IMPORTANT: If granted, tell GA4 to actually start the session now
      if (granted) {
        (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID);
      }
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localConsent = localStorage.getItem("cookie_consent");
    const localVersion = localStorage.getItem("cookie_consent_version");
    const dbConsent = userProfile?.cookie_consent;
    const dbVersion = userProfile?.cookie_consent_version;

    // Case 1: DB has consent. Sync to local and tell GA4.
    if (userId && dbConsent && dbVersion === COOKIE_CONSENT_VERSION) {
      if (localConsent !== "true" || localVersion !== COOKIE_CONSENT_VERSION) {
        localStorage.setItem("cookie_consent", "true");
        localStorage.setItem("cookie_consent_version", COOKIE_CONSENT_VERSION);
      }
      notifyGA4(true);
      setVisible(false);
      setSynced(true);
      return;
    }

    // Case 2: Local has consent but DB doesn't. Sync to DB and tell GA4.
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
      }).catch((err) => console.error("Failed to sync consent to DB", err));

      notifyGA4(true);
      setVisible(false);
      setSynced(true);
      return;
    }

    // Case 3: No consent found anywhere.
    const hasPriorLocalConsent =
      localConsent === "true" && localVersion === COOKIE_CONSENT_VERSION;
    if (hasPriorLocalConsent) {
      notifyGA4(true);
    }

    setVisible(!hasPriorLocalConsent);
    setSynced(true);
  }, [userId, userProfile]);

  const handleAccept = () => {
    // 1. Update Local Storage
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_consent_version", COOKIE_CONSENT_VERSION);

    // 2. Update GA4 state immediately
    notifyGA4(true);

    // 3. UI Update
    setVisible(false);

    // 4. Sync to DB if logged in
    if (userId) {
      fetch("/api/updateCookieConsent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consent: true,
          version: COOKIE_CONSENT_VERSION,
        }),
      }).catch((err) => console.error("Failed to sync consent to DB", err));
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
        className="m-4 px-4 py-3 rounded-lg shadow-lg bg-white/95 border border-gray-200 flex flex-col sm:flex-row items-center gap-3 pointer-events-auto dark:bg-gray-900/95 dark:border-gray-700"
        style={{ maxWidth: 480 }}
        role="dialog"
        aria-label={
          translations["cookies.banner.aria_label"] || "Cookies consent banner"
        }
      >
        <span className="text-sm text-gray-700 flex-1 dark:text-gray-300">
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
