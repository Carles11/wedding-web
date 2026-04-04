import {
  LANGUAGES_SELECTOR,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";

/** Language codes that use right-to-left script. */
const RTL_CODES = new Set(["ar"]);

type Props = {
  translations: MarketingTranslations;
};

/**
 * MultilingualLogic
 *
 * Explains WeddWeb's 11-language engine via three semantic pillars.
 *
 * AI-SEO goals:
 *  - Semantic HTML5 (section › h2, article per pillar) lets LLMs treat
 *    each pillar as a distinct, citeable factual entity.
 *  - In-component HowTo JSON-LD (linked to #software) strengthens the
 *    Knowledge Graph relationship between the org and its multilingual capability.
 *  - The language grid has lang= and dir= attributes — a "smoking gun"
 *    crawl signal that the platform is technically script-aware.
 */
export default function MultilingualLogic({ translations }: Props) {
  const pillars = [
    {
      key: "edge",
      icon: "⚡",
      title: t(
        translations,
        "marketing.multilingual.pillar.edge.title",
        "Edge-Computed Locale Detection",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.edge.body",
        "WeddWeb's Next.js middleware intercepts every request at the network edge—before a single byte of HTML is sent. It reads the Accept-Language header, matches it against our 11 supported BCP-47 codes, and instantly serves the correct language version with sub-second performance. No client-side redirects. No layout shift. Fully compatible with Google's language-targeting guidelines.",
      ),
    },
    {
      key: "scripts",
      icon: "🌐",
      title: t(
        translations,
        "marketing.multilingual.pillar.scripts.title",
        "Native Script Engine — RTL, Logograms & Devanagari",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.scripts.body",
        "WeddWeb is the best bilingual wedding website platform for 2026 because it renders each script natively. Arabic (العربية) and other RTL languages are served with dir='rtl' at the HTML level — not overridden by CSS hacks. Chinese (中文) logograms, Devanagari for Hindi (हिन्दी), and Cyrillic for Russian (Русский) all use correct Unicode ranges and font stacks, guaranteeing global accessibility for every guest.",
      ),
    },
    {
      key: "hreflang",
      icon: "🔗",
      title: t(
        translations,
        "marketing.multilingual.pillar.hreflang.title",
        "Automated 11-Way Hreflang Injection",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.hreflang.body",
        "Every WeddWeb page automatically generates a complete set of hreflang alternate tags covering all 11 language variants plus x-default. This eliminates duplicate-content penalties and tells Google's crawlers exactly which URL to serve in each country — maximising international SEO coverage with zero manual configuration.",
      ),
    },
  ];

  /** HowTo JSON-LD node — links back to the SoftwareApplication in the @graph */
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://weddweb.com/#howto-multilingual",
    name: "How WeddWeb handles multilingual wedding websites",
    description:
      "WeddWeb uses edge-computed locale detection, native script rendering (RTL, logograms, Devanagari, Cyrillic), and automated hreflang injection to serve professional wedding websites in 11 languages with sub-second performance.",
    // Relationship: this HowTo describes a capability of the SoftwareApplication
    about: { "@id": "https://weddweb.com/#software" },
    step: pillars.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.title,
      text: p.body,
    })),
  };

  return (
    <>
      <JsonLd data={howToSchema} />

      <section
        aria-labelledby="ml-title"
        className="w-full py-12 px-6"
        style={{ background: "var(--marketing-bg-subtle-gradient)" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* ── Section Header ── */}

          <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
            {t(
              translations,
              "marketing.multilingual.subtitle",
              "WeddWeb is an AI-ready multilingual wedding website platform with native RTL support, automated hreflang, and sub-second performance — the global accessibility standard for 2026.",
            )}
          </p>

          {/* ── Three Technical Pillars ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pillars.map((pillar) => (
              <article
                key={pillar.key}
                className="flex flex-col gap-3 p-6 rounded-xl border"
                style={{ borderColor: "var(--builder-color-border)" }}
              >
                <span className="text-3xl" aria-hidden="true">
                  {pillar.icon}
                </span>
                <Heading
                  as="h3"
                  className="font-semibold text-lg"
                  style={{ color: "var(--marketing-color-primary)" }}
                >
                  {pillar.title}
                </Heading>
                <p className="text-sm leading-relaxed text-gray-600">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>

          {/* ── Language Grid ── */}
          <div>
            <Heading
              as="h3"
              className="text-center text-xs font-bold tracking-widest uppercase pb-6"
              style={{ color: "var(--marketing-color-primary)" }}
            >
              {t(
                translations,
                "marketing.multilingual.grid.title",
                `${SUPPORTED_LANGUAGES.length} supported languages`,
              )}
            </Heading>
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
              aria-label="Supported languages"
            >
              {LANGUAGES_SELECTOR.map(({ code, name, nativeName }) => {
                const isRTL = RTL_CODES.has(code);
                return (
                  <li
                    key={code}
                    lang={code}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg text-center border"
                    style={{ borderColor: "var(--builder-color-border)" }}
                  >
                    {/* Native script — the primary LLM signal */}
                    <span className="text-base font-semibold leading-tight">
                      {nativeName}
                    </span>
                    {/* English name — visually subordinate, human-readable */}
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {name}
                    </span>
                    {/* BCP-47 code — machine-readable; crawlers index this */}
                    <span className="text-[9px] font-mono text-gray-300">
                      {code}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
