// Mock Supabase and dependent modules BEFORE other imports
jest.mock("@/4-shared/lib/supabase/supabaseServer", () => ({}));
jest.mock("@/4-shared/api/marketing/getTranslations", () => ({
  fetchMarketingTranslations: jest.fn(() => ({})),
}));
jest.mock("@/4-shared/api/marketing", () => ({}));
jest.mock("@/4-shared/lib/getSiteByDomain", () => ({
  getSiteByDomain: async () => null,
}));
jest.mock("@/4-shared/lib/i18n", () => ({
  getMergedTranslations: jest.fn(() => ({})),
}));

// Mock 'next/headers'
jest.mock("next/headers", () => ({
  headers: () => ({
    get: () => "weddweb.com",
  }),
}));

// Then import everything else
//
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { generateMetadata } from "../page";

// Mock 'next/headers' etc as before
jest.mock("next/headers", () => ({
  headers: () => ({
    get: () => "weddweb.com",
  }),
}));
jest.mock("@/4-shared/lib/getSiteByDomain", () => ({
  getSiteByDomain: async () => null,
}));

const seoFiles: Record<string, { marketing: any }> = {
  en: require("@/4-shared/config/seo/marketing/home/en").seoMetadata,
  ca: require("@/4-shared/config/seo/marketing/home/ca").seoMetadata,
  es: require("@/4-shared/config/seo/marketing/home/es").seoMetadata,
  fr: require("@/4-shared/config/seo/marketing/home/fr").seoMetadata,
  de: require("@/4-shared/config/seo/marketing/home/de").seoMetadata,
  it: require("@/4-shared/config/seo/marketing/home/it").seoMetadata,
  pt: require("@/4-shared/config/seo/marketing/home/pt").seoMetadata,
  zh: require("@/4-shared/config/seo/marketing/home/zh").seoMetadata,
  ru: require("@/4-shared/config/seo/marketing/home/ru").seoMetadata,
  ar: require("@/4-shared/config/seo/marketing/home/ar").seoMetadata,
  hi: require("@/4-shared/config/seo/marketing/home/hi").seoMetadata,
};

describe("Marketing SSR SEO metadata matches per-locale translation", () => {
  it.each(SUPPORTED_LANGUAGES)(
    "SSR meta for lang '%s' uses correct translations",
    async (lang) => {
      const expected = seoFiles[lang].marketing;

      const meta = await generateMetadata({
        params: Promise.resolve({ lang }),
      });

      // TITLE
      expect(typeof meta.title).toBe("string"); // Next.js 16+ uses string
      expect(meta.title).toBe(expected.title);

      // DESCRIPTION
      expect(meta.description).toBe(expected.description);

      // OG TITLE / DESC (headless: check openGraph or twitter meta as well)
      expect(meta.openGraph?.title).toBe(expected.ogTitle);
      expect(meta.openGraph?.description).toBe(expected.ogDescription);

      // OG IMAGE
      const ogImages = meta.openGraph?.images;
      let imageUrl: string | undefined;

      if (Array.isArray(ogImages)) {
        const img = ogImages[0];
        // Handle string, URL, or object
        if (typeof img === "string") imageUrl = img;
        else if (typeof img === "object" && img) {
          // OGImageDescriptor: .url, or URL object
          if ("url" in img && typeof img.url === "string") imageUrl = img.url;
          else if (img instanceof URL) imageUrl = img.toString();
        }
      } else if (ogImages) {
        // Handle string, object, or URL
        if (typeof ogImages === "string") imageUrl = ogImages;
        else if (typeof ogImages === "object") {
          if ("url" in ogImages && typeof ogImages.url === "string")
            imageUrl = ogImages.url;
          else if (ogImages instanceof URL) imageUrl = ogImages.toString();
        }
      }

      expect(imageUrl).toMatch(/weddweb-OG\.png/);

      // Canonical
      expect(meta.alternates?.canonical).toBe(expected.canonicalUrl);

      // HREFLANGS (languages)
      for (const { locale, url } of expected.alternateLanguages) {
        expect(meta.alternates?.languages?.[locale]).toBe(url);
      }

      // Keywords (if you want to check as well)
      // expect(meta.keywords).toEqual(expected.keywords);

      // Twitter
      const twitter: any = meta.twitter;
      expect(twitter?.card || twitter?.cardType).toBe(expected.twitterCard);

      // Accept either "en", "en_US", "en_EN"
      const ogLocale = meta.openGraph?.locale;
      const expectedLocale = expected.locale;

      // Accept if it starts with the lang
      expect(ogLocale?.startsWith(expectedLocale)).toBe(true);
    },
  );
});
