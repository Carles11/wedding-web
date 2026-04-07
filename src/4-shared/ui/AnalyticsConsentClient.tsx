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

    // If we have a user and they consented, link their ID to GA4
    if (isConsented && userProfile?.id && (window as any).gtag) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userProfile.id,
      });
    }
  }, [userProfile?.id]);

  if (!checked) return null;

  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      )}

      {!consent && (
        <CookiesConsentBanner
          onAccept={() => setConsent(true)}
          translations={translations}
          lang={lang}
          userId={userProfile?.id ?? null}
          userProfile={userProfile}
        />
      )}
    </>
  );
}
