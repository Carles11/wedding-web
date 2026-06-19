import { LANGUAGES_SELECTOR } from "@/4-shared/config/i18n";
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
        "Every Guest, Instantly at Home",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.edge.body",
        "Before your guest reads a single word, WeddWeb has already identified their preferred language at the network edge. No jarring redirects. No language-selector dropdown they have to hunt for. Just the warmth of your wedding story arriving in the script that feels like home—in under a second.",
      ),
    },
    {
      key: "scripts",
      icon: "🌐",
      title: t(
        translations,
        "marketing.multilingual.pillar.scripts.title",
        "Arabic, Hindi, Chinese—Written Right",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.scripts.body",
        "We don't bolt on a translation plugin. We built a native script engine. Arabic flows right-to-left as it was meant to. Devanagari for Hindi renders with the correct letterforms. Chinese logograms display with precision. Every script is optimized for search visibility, so your shared history is found, honored, and preserved.",
      ),
    },
    {
      key: "hreflang",
      icon: "🔗",
      title: t(
        translations,
        "marketing.multilingual.pillar.hreflang.title",
        "Your Story, Discoverable in Every Language",
      ),
      body: t(
        translations,
        "marketing.multilingual.pillar.hreflang.body",
        "WeddWeb automatically tells every search engine exactly which language version to show to every guest worldwide. No duplicate content. No invisible wedding. Just your story—precisely surfaced, in the right language, in the right country.",
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

          <p className="text-center text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            {t(
              translations,
              "marketing.multilingual.subtitle",
              "The moment the ink dries on your invitations, your family starts spreading across borders. WeddWeb ensures that a grandmother in Mumbai, a cousin in Paris, and a dear friend in Riyadh all feel equally honored—reading every detail of your day in their own native script, perfectly rendered, forever.",
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
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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
                "11 native scripts. One shared story.",
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
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
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
