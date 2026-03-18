import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Crie lindos sites de casamento em minutos",
    description:
      "Crie sites de casamento multilíngues com RSVP, galerias de fotos e mais. Plano gratuito disponível para sempre. Sem necessidade de programar.",
    ogTitle: "WeddWeb - Sites de casamento lindos e fáceis",
    ogDescription: "A maneira mais fácil de criar o site de casamento perfeito",
    ogImage: "https://weddweb.com/og-images/pt-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "site de casamento",
      "RSVP casamento",
      "site de casamento multilíngue",
      "site de casamento grátis",
      "site de evento",
    ],
    canonicalUrl: "https://weddweb.com/pt",
    locale: "pt",
    alternateLanguages: [
      { locale: "en", url: "https://weddweb.com/en" },
      { locale: "es", url: "https://weddweb.com/es" },
      { locale: "ca", url: "https://weddweb.com/ca" },
      { locale: "zh", url: "https://weddweb.com/zh" },
      { locale: "hi", url: "https://weddweb.com/hi" },
      { locale: "ar", url: "https://weddweb.com/ar" },
      { locale: "fr", url: "https://weddweb.com/fr" },
      { locale: "de", url: "https://weddweb.com/de" },
      { locale: "pt", url: "https://weddweb.com/pt" },
      { locale: "ru", url: "https://weddweb.com/ru" },
      { locale: "it", url: "https://weddweb.com/it" },
      { locale: "x-default", url: "https://weddweb.com/en" },
    ],
  },
};

export default seoMetadata;
