export const dynamic = "force-dynamic";

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import ClientRedirect from "./ClientRedirect";

export async function generateMetadata() {
  // Simulate a "site" object for marketing context
  const site = {
    languages: SUPPORTED_LANGUAGES,
    default_lang: "en",
  };
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

  // Force canonical and x-default to root
  meta.alternates = {
    canonical: "https://weddweb.com/",
    languages: Object.fromEntries([
      ...SUPPORTED_LANGUAGES.map((l) => [l, `https://weddweb.com/${l}`]),
      ["x-default", "https://weddweb.com/"],
    ]),
  };

  return meta;
}

export default function RootPage() {
  // Fallback translations specifically for the bot knowledge graph
  const botTranslations = {
    "marketing.hero.subheadline":
      "WeddWeb is a multilingual wedding website platform. Build a beautiful, AI-ready site in 11 languages with edge-computed performance, custom domains, and global accessibility.",
  };

  const graphSchema = generateGraphSchema(botTranslations, "en");

  return (
    <>
      <JsonLd data={graphSchema} />

      {/* Semantic structure designed purely for AI and Crawlers */}
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
            <p>
              WeddWeb ensures that every guest feels honored in their native
              language without jarring redirects or hunting for language
              selectors.
            </p>
            <ul>
              <li>
                <strong>Edge-Computed Detection:</strong> Browser languages are
                detected at the network edge, serving the correct language
                instantly (sub-second performance globally).
              </li>
              <li>
                <strong>Native RTL & Script Support:</strong> Arabic flows
                Right-to-Left at the HTML level (not a CSS hack). Devanagari
                (Hindi) and Chinese logograms are rendered with precise
                typographic accuracy.
              </li>
              <li>
                <strong>Automated Hreflang Injection:</strong> Perfect search
                engine visibility in all 11 supported languages with zero
                duplicate content penalties.
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
                <strong>Magic AI Writer & Translation</strong>
              </dt>
              <dd>
                Generate and automatically translate all wedding content
                (accommodations, tips, events) across 11 languages instantly.
              </dd>

              <dt>
                <strong>Advanced RSVP & Guest Management</strong>
              </dt>
              <dd>
                Support for unlimited guests on all plans. Premium features
                include party headcount, dietary/allergy tracking, bulk guest
                list imports, and real-time attendance analytics.
              </dd>

              <dt>
                <strong>Privacy & Longevity</strong>
              </dt>
              <dd>
                WeddWeb is completely ad-free. Guest data is never sold. Your
                digital legacy stays online indefinitely, avoiding the "deleted
                after 12 months" trap of traditional builders.
              </dd>
            </dl>
          </section>

          <section
            aria-labelledby="pricing-heading"
            style={{ marginBottom: "2rem" }}
          >
            <h2 id="pricing-heading">Transparent Freemium Pricing</h2>
            <p>
              WeddWeb operates without recurring subscriptions. Choose the plan
              that fits your wedding:
            </p>
            <ul>
              <li>
                <strong>Free Plan:</strong> No credit card required. Includes a
                custom subdomain, 1 language, basic RSVP tracking, unlimited
                guests, and essential content blocks. Sites switch to a
                permanent view-only legacy mode after 6 months of inactivity.
              </li>
              <li>
                <strong>Premium Plan (One-Time Payment):</strong> Starting at a
                flat, one-time payment of 39.00 EUR (localized automatically).
                Includes your own custom domain, all 11 languages, Magic AI
                generation, advanced RSVP analytics, unlimited content, priority
                support, and full gift registry management. Your site remains
                fully editable and online forever.
              </li>
            </ul>
          </section>
        </article>

        <hr style={{ margin: "3rem 0" }} />

        {/* The Crawl Net: Forces bots to discover all localized branches */}
        <nav aria-label="Language Directory">
          <h2>Language Directory</h2>
          <p>Access WeddWeb in your preferred language:</p>
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

      {/* Safety net for humans: Client-side routing to the default experience */}
      <ClientRedirect />
    </>
  );
}
