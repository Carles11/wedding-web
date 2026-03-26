import { expect, test } from "@playwright/test";

const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
  "ca",
  "ar",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
];

test.describe("SEO/Meta for all marketing languages", () => {
  SUPPORTED_LANGUAGES.forEach((lang) => {
    test(`marketing home /${lang} has correct title & head tags`, async ({
      page,
    }) => {
      await page.goto(`http://localhost:3000/${lang}`);

      // Title
      await expect(page).toHaveTitle(
        /weddweb|wedding|casament|网站|свадебный/i,
      );

      // Meta description (non-empty)
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(desc && desc.length > 30).toBeTruthy();

      // Canonical tag
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical).toContain(`/${lang}`);

      // Hreflang for current and all others
      for (const supported of SUPPORTED_LANGUAGES) {
        const hreflang = await page
          .locator(`link[rel="alternate"][hreflang="${supported}"]`)
          .getAttribute("href");
        expect(hreflang).toContain(`/${supported}`);
      }
      // x-default
      const xDefault = await page
        .locator('link[rel="alternate"][hreflang="x-default"]')
        .getAttribute("href");
      expect(xDefault).toContain("/en");

      // og:title, og:description, og:image present
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle && ogTitle.length > 5).toBeTruthy();

      const ogDesc = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(ogDesc && ogDesc.length > 5).toBeTruthy();

      const ogImg = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      expect(ogImg && ogImg.includes("weddweb")).toBeTruthy();

      // twitter:card, twitter:title present
      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute("content");
      expect(twitterCard).toMatch(/summary/i);

      const twitterTitle = await page
        .locator('meta[name="twitter:title"]')
        .getAttribute("content");
      expect(twitterTitle && twitterTitle.length > 5).toBeTruthy();
    });
  });
});
