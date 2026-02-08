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
    canonicalUrl: "https://weddweb.com?lang=pt",
    locale: "pt",
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
