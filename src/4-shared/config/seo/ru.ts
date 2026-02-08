import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - Создавайте красивые свадебные сайты за минуты",
    description:
      "Создавайте многоязычные свадебные сайты с RSVP, фотогалереями и другим функционалом. Бесплатный тариф навсегда. Не требуется программирование.",
    ogTitle: "WeddWeb - Красивые свадебные сайты просто",
    ogDescription: "Самый простой способ создать идеальный свадебный сайт",
    ogImage: "https://weddweb.com/og-images/ru-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "свадебный сайт",
      "RSVP на свадьбу",
      "многоязычный свадебный сайт",
      "бесплатный сайт для свадьбы",
      "сайт мероприятия",
    ],
    canonicalUrl: "https://weddweb.com?lang=ru",
    locale: "ru",
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
