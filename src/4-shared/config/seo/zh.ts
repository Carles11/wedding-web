import type { SitewideSEO } from "./types";

export const seoMetadata: SitewideSEO = {
  marketing: {
    title: "WeddWeb - 在几分钟内创建漂亮的婚礼网站",
    description:
      "使用 RSVP、照片库等功能，轻松搭建多语言婚礼网站。永久免费计划可用，无需编程。",
    ogTitle: "WeddWeb - 轻松创建漂亮的婚礼网站",
    ogDescription: "创建完美婚礼网站的最简单方式",
    ogImage: "https://weddweb.com/og-images/zh-home.jpg",
    twitterCard: "summary_large_image",
    keywords: [
      "婚礼网站",
      "婚礼 RSVP",
      "多语言 婚礼 网站",
      "免费 婚礼 网站",
      "活动 网站",
    ],
    canonicalUrl: "https://weddweb.com/zh",
    locale: "zh",
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
