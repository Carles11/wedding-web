/**
 * Root Layout — src/app/layout.tsx
 *
 * The ONLY layout in the app that renders <html> and <body>.
 * Applies to ALL routes: /, /en/, /es/, /ar/, etc.
 *
 * Language is detected from the x-detected-lang request header,
 * which is set by src/proxy.ts for every incoming request.
 */
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import {
  GOOGLE_SITE_VERIFICATION,
  THEME_COLOR,
  THEME_COLOR_DARK,
} from "@/4-shared/config/seo/meta";
import { allFontInstances } from "@/4-shared/lib/fonts/fontRegistry";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = await headers();

  // Read lang forwarded by proxy.ts via x-detected-lang header.
  // Falls back to "en" for any uncovered edge case.
  const raw = headersList.get("x-detected-lang") ?? "en";
  const lang = SUPPORTED_LANGUAGES.includes(
    raw as (typeof SUPPORTED_LANGUAGES)[number],
  )
    ? raw
    : "en";

  const isRTL = lang === "ar";
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
        <meta name="theme-color" content={THEME_COLOR} media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content={THEME_COLOR_DARK} media="(prefers-color-scheme: dark)" />
        <meta name="language" content={lang} />
        <meta
          name="google-site-verification"
          content={GOOGLE_SITE_VERIFICATION}
        />
        <meta name="yandex-verification" content="21ca7d8dc3b9cc74" />
      </head>
      <body className={`${fontVariables} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
