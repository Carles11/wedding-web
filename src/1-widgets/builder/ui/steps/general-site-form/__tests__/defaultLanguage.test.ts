import {
  clearDefaultLanguageIfRemoved,
  getEffectiveBuilderLanguage,
  isSelectedDefaultLanguage,
} from "../defaultLanguage";

describe("general-site-form default language helpers", () => {
  it("recognizes a valid selected default language", () => {
    expect(isSelectedDefaultLanguage("en", ["en", "de"])).toBe(true);
    expect(isSelectedDefaultLanguage("", ["en", "de"])).toBe(false);
    expect(isSelectedDefaultLanguage("fr", ["en", "de"])).toBe(false);
  });

  it("falls back to the first selected language when default is invalid", () => {
    expect(getEffectiveBuilderLanguage(["en", "de"], "")).toBe("en");
    expect(getEffectiveBuilderLanguage(["en", "de"], "fr" as never)).toBe("en");
  });

  it("clears the default only when the removed language was the default", () => {
    expect(clearDefaultLanguageIfRemoved("de", "de")).toBe("");
    expect(clearDefaultLanguageIfRemoved("de", "en")).toBe("en");
  });
});
