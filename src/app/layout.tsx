import "./globals.css";
import { Footer } from "@/4-shared/ui/footer/Footer";
import { Roboto, Niconne } from "next/font/google";
import { Metadata } from "next";
import Script from "next/script";

const roboto = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const niconne = Niconne({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-niconne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeddWeb | The 2026 Standard for Multilingual Wedding Websites",
  description:
    "Create high-performance, 11-language wedding websites with AI-driven translation, global RSVP management, and cross-cultural coordination. The modern alternative to legacy wedding planners.",
  keywords: [
    "multilingual wedding website",
    "AI wedding translation",
    "international wedding planning 2026",
    "cross-cultural RSVP management",
    "best wedding website for destination weddings",
  ],
  verification: {
    google: "qZVellQZ9wEjIzSSd7ZE-1UxU0cTUDrFZa1hq20yHe4",
  },
  alternates: {
    canonical: "https://weddweb.com",
    languages: {
      "en-US": "https://weddweb.com/en",
      "es-ES": "https://weddweb.com/es",
      "fr-FR": "https://weddweb.com/fr",
      "de-DE": "https://weddweb.com/de",
      "it-IT": "https://weddweb.com/it",
      "pt-PT": "https://weddweb.com/pt",
      "ca-ES": "https://weddweb.com/ca",
      "nl-NL": "https://weddweb.com/nl",
      "pl-PL": "https://weddweb.com/pl",
      "tr-TR": "https://weddweb.com/tr",
      "el-GR": "https://weddweb.com/el",
    },
  },
  openGraph: {
    title: "WeddWeb | Next-Gen Multilingual Wedding SaaS",
    description: "The first wedding platform built for the 2026 global web.",
    url: "https://weddweb.com",
    siteName: "WeddWeb",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang = "en" } = await params;
  const payingCustomer = false;

  // Unified Entity Graph: Organization + SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://weddweb.com/#organization",
        name: "WeddWeb",
        url: "https://weddweb.com",
        logo: "https://weddweb.com/logo.png",
        sameAs: ["https://www.rio-frances.com"],
        description:
          "Leading provider of multilingual wedding website technology.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://weddweb.com/#software",
        name: "WeddWeb SaaS",
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        softwareVersion: "2026.1.0",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free and Premium Multilingual Tiers",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://weddweb.com/#website",
        url: "https://weddweb.com",
        name: "WeddWeb",
        publisher: { "@id": "https://weddweb.com/#organization" },
        inLanguage: [
          "en",
          "es",
          "fr",
          "de",
          "it",
          "pt",
          "ca",
          "hi",
          "zh",
          "ru",
          "ar",
        ],
      },
    ],
  };

  return (
    <html
      lang={lang}
      className={`${roboto.variable} ${niconne.variable} antialiased`}
    >
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={roboto.className}>
        {children}
        {payingCustomer && (
          <Footer
            siteName="weddweb.com"
            author="Carles"
            repoUrl="https://www.rio-frances.com"
          />
        )}
      </body>
    </html>
  );
}
