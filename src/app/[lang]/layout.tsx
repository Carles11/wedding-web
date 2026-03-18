import Head from "next/head";
import { ReactNode } from "react";
import "../globals.css";

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WeddWeb",
  url: "https://weddweb.com",
  logo: "https://weddweb.com/android-chrome-192x192.png",
  sameAs: [
    "https://www.facebook.com/weddweb",
    "https://www.instagram.com/weddweb",
  ],
};
const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://weddweb.com",
  name: "WeddWeb",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://weddweb.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function LangLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Optional: Safari pinned tab icon */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="language"
          content={
            typeof window !== "undefined" ? document.documentElement.lang : "en"
          }
        />
        <meta
          name="google-site-verification"
          content="YOUR_GOOGLE_VERIFICATION"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSONLD),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
