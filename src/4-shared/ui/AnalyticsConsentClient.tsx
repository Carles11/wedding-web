// 4-shared/ui/AnalyticsConsentClient.tsx
"use client";

import { COOKIE_CONSENT_VERSION } from "@/4-shared/config/consents/versions";
import { CookiesConsentBanner } from "@/4-shared/ui/CookiesConsentBanner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function AnalyticsConsentClient({
  lang,
  userProfile,
  translations,
}: any) {
  const [consent, setConsent] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const localConsent = localStorage.getItem("cookie_consent");
    const localVersion = localStorage.getItem("cookie_consent_version");

    const isConsented =
      localConsent === "true" && localVersion === COOKIE_CONSENT_VERSION;

    setConsent(isConsented);
    setChecked(true);
  }, []);

  const handleAccept = () => setConsent(true);

  // 1. We still wait for the check to avoid showing the banner to people who already accepted
  if (!checked) return null;

  return (
    <>
      {/* 2. THE FIX: Always render the GA component in production */}
      {/* This ensures it shows up in view-source and Tag Assistant finds it */}
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      )}

      {!consent && (
        <CookiesConsentBanner
          onAccept={handleAccept}
          translations={translations}
          lang={lang}
          userId={userProfile?.id ?? null}
          userProfile={userProfile}
        />
      )}
    </>
  );
}
