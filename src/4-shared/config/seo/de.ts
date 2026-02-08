import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Erstelle in Minuten schöne Hochzeitswebsites",
    description:
      "Erstelle mehrsprachige Hochzeitswebsites mit RSVP, Fotogalerien und mehr. Kostenloser Forever-Plan verfügbar. Kein Programmieraufwand nötig.",
    ogTitle: "WeddWeb - Schöne Hochzeitswebsites leicht gemacht",
    ogDescription:
      "Der einfachste Weg, deine perfekte Hochzeitswebsite zu erstellen",
    ogImage: "https://weddweb.com/og-images/de-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "Hochzeitswebsite",
      "Hochzeit RSVP",
      "mehrsprachige Hochzeitsseite",
      "kostenlose Hochzeitswebsite",
      "Event-Website",
    ],
    canonicalUrl: "https://weddweb.com?lang=de",
    locale: "de",
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
