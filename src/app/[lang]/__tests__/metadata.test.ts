// Mock all modules that require Supabase, DB, or server env on import
jest.mock("@/4-shared/lib/supabase/supabaseServer", () => ({}));
jest.mock("@/4-shared/api/marketing/getTranslations", () => ({
  fetchMarketingTranslations: jest.fn(() => ({})), // Provide a dummy translation object
}));
jest.mock("@/4-shared/api/marketing", () => ({}));
jest.mock("@/4-shared/lib/getSiteByDomain", () => ({
  getSiteByDomain: async () => null,
}));
jest.mock("@/4-shared/lib/i18n", () => ({
  getMergedTranslations: jest.fn(() => ({})),
}));

import { generateMetadata } from "../page";

// Mocks for any external fetches/helpers in your marketing meta function
jest.mock("@/4-shared/lib/getSiteByDomain", () => ({
  getSiteByDomain: async () => null, // To test marketing, not tenant
}));
jest.mock("next/headers", () => ({
  headers: () => ({
    get: () => "weddweb.com", // mock host header
  }),
}));

// Mock getSEOMetadata to a static value for deterministic test
jest.mock("@/4-shared/config/seo", () => ({
  getSEOMetadata: () => ({
    title: "Create Stunning Wedding Websites | WeddWeb",
    description: "Multilingual, SaaS-ready platform for any celebration.",
    ogTitle: "Create Your Dream Wedding Website",
    ogDescription: "The only SaaS platform you need for event sites.",
    ogImage: "https://weddweb.com/assets/og/weddweb-OG.png",
  }),
}));

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";

describe("generateMetadata (marketing, SSR)", () => {
  it('produces correct meta tags for "en" marketing page', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ lang: "en" }),
    });

    // TITLE
    expect(meta.title).toMatch(/wedding|weddweb/i);

    // DESCRIPTION
    expect(meta.description).toMatch(/multilingual|saas-ready/i);

    // CANONICAL
    expect(meta.alternates?.canonical).toBe("https://weddweb.com/en");

    // HREFLANG
    expect(meta.alternates?.languages?.en).toBe("https://weddweb.com/en");
    expect(meta.alternates?.languages?.["x-default"]).toBe(
      "https://weddweb.com/en",
    );

    // OPENGRAPH
    expect(meta.openGraph?.title).toMatch(/dream wedding/i);

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

    // TWITTER
    // Twitter meta (allow any property, future-ready)
    const twitterMeta = meta.twitter as any;
    expect(twitterMeta?.card).toBe("summary_large_image");
    expect(twitterMeta?.title).toMatch(/wedding|weddweb/i);
    expect(twitterMeta?.images?.[0]).toContain("weddweb-OG.png");
  });

  it("has hreflang for all supported languages", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ lang: "en" }),
    });

    const languages = meta.alternates?.languages ?? {};
    for (const l of SUPPORTED_LANGUAGES) {
      expect(languages[l]).toBe(`https://weddweb.com/${l}`);
    }
  });
});
