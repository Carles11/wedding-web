import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title:
      "WeddWeb - Créez de magnifiques sites de mariage en quelques minutes",
    description:
      "Créez des sites de mariage multilingues et élégants avec RSVP, galeries photos et bien plus. Plan gratuit disponible à vie. Aucun code requis.",
    ogTitle: "WeddWeb - Sites de mariage beaux et faciles",
    ogDescription:
      "La manière la plus simple de créer votre site de mariage parfait",
    ogImage: "https://weddweb.com/og-images/fr-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "site mariage",
      "RSVP mariage",
      "site mariage multilingue",
      "site mariage gratuit",
      "site événement",
    ],
    canonicalUrl: "https://weddweb.com?lang=fr",
    locale: "fr",
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
