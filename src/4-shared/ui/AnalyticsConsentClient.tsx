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
    setConsent(
      localConsent === "true" && localVersion === COOKIE_CONSENT_VERSION,
    );
    setChecked(true);
  }, []);

  const handleAccept = () => setConsent(true);

  if (!checked) return null;

  return (
    <>
      {!consent && (
        <CookiesConsentBanner
          onAccept={handleAccept}
          translations={translations}
          lang={lang}
          userId={userProfile?.id ?? null}
          userProfile={userProfile}
        />
      )}
      {consent && process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      )}
    </>
  );
}
