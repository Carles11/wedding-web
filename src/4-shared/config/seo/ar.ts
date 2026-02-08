import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - أنشئ مواقع زفاف جميلة في دقائق",
    description:
      "ابنِ مواقع زفاف متعددة اللغات مع تأكيد الحضور (RSVP)، ومعارض الصور والمزيد. خطة مجانية متاحة دائمًا. لا حاجة للبرمجة.",
    ogTitle: "WeddWeb - مواقع زفاف جميلة بسهولة",
    ogDescription: "أسهل طريقة لإنشاء موقع زفاف مثالي لك",
    ogImage: "https://weddweb.com/og-images/ar-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "موقع زفاف",
      "تأكيد الحضور للزفاف",
      "موقع زفاف متعدد اللغات",
      "موقع زفاف مجاني",
      "موقع فعالية",
    ],
    canonicalUrl: "https://weddweb.com?lang=ar",
    locale: "ar",
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
