import {
  GOOGLE_SITE_VERIFICATION,
  THEME_COLOR,
} from "@/4-shared/config/seo/meta";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { allFontInstances } from "@/4-shared/lib/fonts/fontRegistry";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import type { Metadata } from "next";
// import { GoogleAnalytics } from "@next/third-parties/google";
import { AnalyticsWithConsent } from "@/4-shared/ui/AnalyticsWithConsent";
import { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";
  const isRTL = lang === "ar"; // 🚀 The Smoking Gun for Arabic
  const fontVariables = allFontInstances.map((f) => f.variable).join(" ");

  return (
    <html
      lang={lang}
      dir={isRTL ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="manifest"
          href={`/manifests/${lang}/site.webmanifest`}
          crossOrigin="use-credentials"
        />

        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="language" content={lang} />
        <meta
          name="google-site-verification"
          content={GOOGLE_SITE_VERIFICATION}
        />
        <meta name="yandex-verification" content="21ca7d8dc3b9cc74" />
        {/*
        Single consolidated @graph block — Organization, WebSite, and SoftwareApplication
        are linked via @id references so LLMs and structured-data validators see one
        coherent semantic entity instead of multiple disconnected scripts.

        SoftwareApplication uses PLAN_CATALOG static titles as fallbacks here (layout has
        no translations). The marketing page does NOT inject a duplicate — this is the
        single source of truth for all three entities.
      */}
      </head>
      <body className={`${fontVariables} antialiased`}>
        <JsonLd data={generateGraphSchema({}, lang)} />
        {children}
        {/* Google Analytics with consent banner */}
        {/*
          To fully enable i18n and user-aware consent, pass translations, lang, userId, userProfile as props if available.
          This layout does not have those props directly, so you may need to wrap children or pass them from page components.
        */}
        <AnalyticsWithConsent lang={lang} />
      </body>
    </html>
  );
}
