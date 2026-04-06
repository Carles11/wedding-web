import {
  ORGANIZATION_JSONLD,
  WEBSITE_JSONLD,
} from "@/4-shared/config/seo/meta";
import { generateSoftwareSchema } from "./generateSoftwareSchema";

/**
 * Builds a single, interconnected JSON-LD @graph object containing:
 *   - Organization  (id: #organization)
 *   - WebSite       (id: #website,  publisher → #organization)
 *   - SoftwareApplication (id: #software, provider → #organization)
 *
 * All three entities are linked via @id references, giving LLMs and
 * search engine validators a clear semantic picture of the platform.
 *
 * Returns the complete graph object — wrap in <script type="application/ld+json">
 * via <JsonLd> or dangerouslySetInnerHTML.
 *
 * @param translations - Localized strings (for SoftwareApplication description/features).
 * @param lang         - BCP-47 language code for the current page.
 */
export function generateGraphSchema(
  translations: Record<string, string>,
  lang: string,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION_JSONLD,
      WEBSITE_JSONLD,
      generateSoftwareSchema(translations, lang),
    ],
  };
}

/**
 * Generates a WebPage node with Speakable schema for the marketing home page.
 *
 * MARKETING ONLY — do NOT inject this on tenant (wedding) sites.
 *
 * The cssSelector values must match the id attributes on the rendered DOM:
 *   - #hero-title   → <h1 id="hero-title"> in HeroMarketing.tsx
 *   - #hero-summary → <p  id="hero-summary"> in HeroMarketing.tsx
 *
 * The description field is intentionally identical to the hero subheadline text
 * so the WebPage description and the speakable text are semantically aligned.
 *
 * @param description - The localized hero subheadline (translations["marketing.hero.subheadline"]).
 * @param lang        - BCP-47 language code for the current page.
 */
export function generateWebPageSchema(description: string, lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://weddweb.com/${lang}/#webpage`,
    url: `https://weddweb.com/${lang}`,
    name: "WeddWeb — Multilingual Wedding Websites",
    // Mirrors the hero-summary text for perfect semantic alignment
    description:
      description ||
      "WeddWeb is a multilingual wedding website platform. Build a beautiful, AI-ready site in 11 languages with sub-second performance, custom domains, and global accessibility.",
    inLanguage: lang,
    // Relationship: this page belongs to the WebSite entity in the @graph
    isPartOf: { "@id": "https://weddweb.com/#website" },
    // Speakable: tells voice assistants and AI agents exactly which
    // sentences to read when summarizing WeddWeb's service
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#hero-title", "#hero-summary"],
    },
  };
}
