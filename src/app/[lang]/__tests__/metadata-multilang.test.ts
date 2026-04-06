jest.mock("next/headers", () => ({
  headers: () => ({
    get: () => "weddweb.com", // or whatever fake host fits your logic
  }),
}));

// Mock all modules relying on Supabase or DB as in your previous SSR test
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
// If you mock getSEOMetadata, consider setting per-lang titles to test output

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { getMetaDesc } from "@/4-shared/helpers/test-helpers/getMetaDescription";
import { getMetaTitle } from "@/4-shared/helpers/test-helpers/getMetaTitle";
import { generateMetadata } from "../page";

describe("SSR meta tags for all supported languages", () => {
  it.each(SUPPORTED_LANGUAGES)(
    "renders correct SEO meta data for lang '%s'",
    async (lang) => {
      const meta = await generateMetadata({
        params: Promise.resolve({ lang }),
      });

      // Title & Description
      const title = getMetaTitle(meta);
      expect(typeof title).toBe("string");
      expect(title.toLowerCase()).toContain("weddweb");

      const description = getMetaDesc(meta);
      expect(typeof description).toBe("string");
      expect(description.length).toBeGreaterThan(0);

      // Canonical URL includes correct language
      expect(meta.alternates?.canonical).toMatch(new RegExp(`/${lang}\\b`));

      // Hreflang for all supported languages and x-default
      const langs = meta.alternates?.languages || {};
      for (const supportedLang of SUPPORTED_LANGUAGES) {
        expect(langs[supportedLang]).toBe(
          `https://weddweb.com/${supportedLang}`,
        );
      }
      expect(langs["x-default"]).toBe(`https://weddweb.com/en`);

      // OpenGraph locale/tag coverage (optional, if supported)
      const og = meta.openGraph as any;
      if (og) {
        if (og.locale) {
          expect(og.locale).toMatch(/[a-z]{2}_[A-Z]{2}/);
        }
        // OG image presence
        const images = og.images;
        let ogImageUrl = "";
        if (Array.isArray(images)) {
          const img = images[0];
          if (typeof img === "string") ogImageUrl = img;
          else if (typeof img === "object" && img) {
            if ("url" in img && typeof img.url === "string")
              ogImageUrl = img.url;
            else if (img instanceof URL) ogImageUrl = img.toString();
          }
        } else if (images) {
          if (typeof images === "string") ogImageUrl = images;
          else if (typeof images === "object") {
            if ("url" in images && typeof images.url === "string")
              ogImageUrl = images.url;
            else if (images instanceof URL) ogImageUrl = images.toString();
          }
        }
        expect(ogImageUrl).toContain("weddweb-OG.png"); // Your site branding
      }
    },
  );
});
