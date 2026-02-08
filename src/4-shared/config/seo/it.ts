import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Crea splendidi siti per matrimoni in pochi minuti",
    description:
      "Crea siti per matrimoni multilingue con RSVP, gallerie fotografiche e altro. Piano gratuito disponibile per sempre. Nessuna programmazione richiesta.",
    ogTitle: "WeddWeb - Siti per matrimoni belli e facili",
    ogDescription:
      "Il modo più semplice per creare il sito perfetto per il tuo matrimonio",
    ogImage: "https://weddweb.com/og-images/it-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "sito matrimonio",
      "RSVP matrimonio",
      "sito matrimonio multilingue",
      "sito matrimonio gratis",
      "sito evento",
    ],
    canonicalUrl: "https://weddweb.com?lang=it",
    locale: "it",
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
