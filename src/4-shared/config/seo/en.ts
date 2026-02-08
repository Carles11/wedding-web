import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Create Beautiful Wedding Websites in Minutes",
    description:
      "Build stunning, multilingual wedding websites with RSVP, photo galleries, and more. Free forever plan available. No coding required.",
    ogTitle: "WeddWeb - Beautiful Wedding Websites Made Easy",
    ogDescription: "The easiest way to create your perfect wedding website",
    ogImage: "https://weddweb.com/og-images/en-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "wedding website",
      "wedding RSVP",
      "multilingual wedding site",
      "free wedding website",
      "event website",
    ],
    canonicalUrl: "https://weddweb.com",
    locale: "en",
    alternateLanguages: [
      { locale: "en", url: "https://weddweb.com" },
      { locale: "es", url: "https://weddweb.com?lang=es" },
      { locale: "ca", url: "https://weddweb.com?lang=ca" },
      { locale: "zh", url: "https://weddweb.com?lang=zh" },
      { locale: "hi", url: "https://weddweb.com?lang=hi" },
      { locale: "ar", url: "https://weddweb.com?lang=ar" },
      { locale: "fr", url: "https://weddweb.com?lang=fr" },
      { locale: "de", url: "https://weddweb.com?lang=de" },
      { locale: "pt", url: "https://weddweb.com?lang=pt" },
      { locale: "ru", url: "https://weddweb.com?lang=ru" },
      { locale: "it", url: "https://weddweb.com?lang=it" },
    ],
  },
};

export default seoMetadata;
