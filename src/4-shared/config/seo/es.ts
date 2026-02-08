import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Crea hermosas páginas de boda en minutos",
    description:
      "Crea sitios web de bodas impresionantes y multilingües con confirmación de asistencia, galerías de fotos y más. Plan gratuito disponible para siempre. Sin necesidad de programar.",
    ogTitle: "WeddWeb - Sitios de boda hermosos y fáciles",
    ogDescription: "La forma más fácil de crear la web perfecta para tu boda",
    ogImage: "https://weddweb.com/og-images/es-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "sitio web de boda",
      "confirmación de asistencia boda",
      "sitio de boda multilingüe",
      "sitio de boda gratis",
      "sitio de evento",
    ],
    canonicalUrl: "https://weddweb.com?lang=es",
    locale: "es",
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
