// 4-shared/ui/AnalyticsConsentClient.tsx
"use client";

import { COOKIE_CONSENT_VERSION } from "@/4-shared/config/consents/versions";
import { CookiesConsentBanner } from "@/4-shared/ui/CookiesConsentBanner";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
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
      {/* 1. Mandatory for "Verify Consent": Set default state to denied */}
      <Script id="ga-consent-defaults" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        `}
      </Script>

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
