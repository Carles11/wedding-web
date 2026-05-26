export const dynamic = "force-dynamic";

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";

/**
 * Root page — only reached by search engine bots.
 * Human users are redirected at the edge in src/proxy.ts before this renders.
 *
 * Renders real, indexable English marketing content with:
 * - Self-referencing canonical: https://weddweb.com/
 * - Full hreflang set for all supported languages
 * - x-default pointing to https://weddweb.com/ (not /en/)
 */

export async function generateMetadata() {
  const site = { languages: SUPPORTED_LANGUAGES, default_lang: "en" };
  const baseUrl = "https://weddweb.com";
  const lang = "en";
  const translations = {
    "meta.marketing_title": "WeddWeb — Multilingual Wedding Website Builder",
    "meta.marketing_description":
      "Create your wedding website in 11+ languages. Native RTL, edge-computed localization, and zero recurring subscriptions.",
  };

  const meta = generateSiteMetadata({
    site,
    lang,
    translations,
    baseUrl,
    pageKind: "marketing",
  });

  // Override alternates to ensure canonical is the root URL,
  // and x-default points to the root — not /en/
  meta.alternates = {
    canonical: "https://weddweb.com/",
    languages: Object.fromEntries([
      ...SUPPORTED_LANGUAGES.map((l) => [l, `https://weddweb.com/${l}`]),
      ["x-default", "https://weddweb.com/"],
    ]),
  };

  return meta;
}

export default async function RootPage() {
  // No UA detection or redirect here — that is handled upstream in proxy.ts.
  // This page always renders SEO content for bots that reach it.

  const botTranslations = {
    "marketing.hero.subheadline":
      "WeddWeb is a multilingual wedding website platform. Build a beautiful, AI-ready site in 11 languages with edge-computed performance, custom domains, and global accessibility.",
  };

  const graphSchema = generateGraphSchema(botTranslations, "en");

  return (
    <>
      <JsonLd data={graphSchema} />
      <main
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "sans-serif",
          lineHeight: "1.6",
        }}
      >
        <article>
          <header style={{ marginBottom: "3rem" }}>
            <h1 id="hero-title">
              WeddWeb: The Premier Multilingual Wedding Website Builder
            </h1>
            <p id="hero-summary">
              {botTranslations["marketing.hero.subheadline"]}
            </p>
          </header>

          <section
            aria-labelledby="localization-heading"
            style={{ marginBottom: "2rem" }}
          >
            <h2 id="localization-heading">Global Localization Engine</h2>
            <ul>
              <li>
                <strong>Edge-Computed Detection:</strong> Browser languages
                detected at the network edge.
              </li>
              <li>
                <strong>Native RTL & Script Support:</strong> Proper HTML-level
                flow for Arabic, Hindi, and Chinese.
              </li>
              <li>
                <strong>Automated Hreflang Injection:</strong> Perfect SEO
                visibility in 11 languages.
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="features-heading"
            style={{ marginBottom: "2rem" }}
          >
            <h2 id="features-heading">Core Platform Capabilities</h2>
            <dl>
              <dt>
                <strong>Magic AI Writer</strong>
              </dt>
              <dd>
                Generate and translate wedding content across 11 languages
                instantly.
              </dd>
              <dt>
                <strong>Advanced RSVP</strong>
              </dt>
              <dd>
                Unlimited guests, dietary tracking, and attendance analytics.
              </dd>
              <dt>
                <strong>Privacy</strong>
              </dt>
              <dd>
                Ad-free, zero data selling, and permanent online longevity.
              </dd>
            </dl>
          </section>
        </article>

        <nav aria-label="Language Directory">
          <h2>Language Directory</h2>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              listStyle: "none",
              padding: 0,
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <li key={lang}>
                <a href={`/${lang}`}>WeddWeb in {lang.toUpperCase()}</a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
