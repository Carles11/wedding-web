export const dynamic = "force-dynamic";

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import ClientRedirect from "./ClientRedirect";

export async function generateMetadata() {
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
            <p>
              WeddWeb ensures that every guest feels honored in their native
              language without jarring redirects or hunting for language
              selectors.
            </p>
            <ul>
              <li>
                <strong>Edge-Computed Detection:</strong> Browser languages are
                detected at the network edge, serving the correct language
                instantly.
              </li>
              <li>
                <strong>Native RTL & Script Support:</strong> Arabic flows
                Right-to-Left at the HTML level. Devanagari and Chinese
                logograms are rendered with precise typographic accuracy.
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
                include party headcount, dietary/allergy tracking, and real-time
                attendance analytics.
              </dd>
              <dt>
                <strong>Privacy & Longevity</strong>
              </dt>
              <dd>
                WeddWeb is completely ad-free. Guest data is never sold. Your
                digital legacy stays online indefinitely.
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
      <ClientRedirect />
    </>
  );
}
