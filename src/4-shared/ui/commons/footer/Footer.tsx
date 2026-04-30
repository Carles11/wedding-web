import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types";
import Link from "next/link";

type FooterProps = {
  author?: string;
  repoUrl?: string;
  siteName?: string;
  lang?: string;
  translations: MarketingTranslations;
};

export function Footer({
  author = "Carles del Río",
  repoUrl = "https://github.com/Carles11/",
  siteName = "WeddWeb.com",
  lang = "",
  translations,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const langPrefix = lang ? `/${lang}` : "";
  const env = process.env.NODE_ENV?.toUpperCase() || "PRODUCTION";

  return (
    <footer
      className="footer-root relative w-full overflow-hidden px-6 pb-9 pt-16 font-sans md:px-12"
      style={{
        background: "var(--marketing-bg-subtle-gradient)",
        borderTop: "1px solid var(--builder-color-border)",
        color: "var(--foreground)",
      }}
    >
      {/* Social Profile Links */}
      <nav
        aria-label="Social profiles"
        className="mb-8 flex flex-wrap gap-4 items-center justify-center"
      >
        <a
          href="https://www.facebook.com/weddweb"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
          className="hover:opacity-80 focus-visible:ring-2 rounded-full p-2"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17 2.5h-2.5A4.5 4.5 0 0 0 10 7v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1H17V2.5Z" />
          </svg>
        </a>
        <a
          href="https://x.com/weddweb_com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X / Twitter"
          title="X / Twitter"
          className="hover:opacity-80 focus-visible:ring-2 rounded-full p-2"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/company/weddweb/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
          className="hover:opacity-80 focus-visible:ring-2 rounded-full p-2"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
          </svg>
        </a>

        <a
          href="https://www.tiktok.com/@weddweb_com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          title="TikTok"
          className="hover:opacity-80 focus-visible:ring-2 rounded-full p-2"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M9 17a4 4 0 1 1 0-8v8Zm0 0V7m6 0v10a4 4 0 1 0 4-4" />
          </svg>
        </a>
      </nav>
      <style>{`
        .footer-nav-link { color: var(--builder-color-text-muted); text-decoration: none; transition: color 0.2s; }
        .footer-nav-link:hover { color: var(--marketing-color-primary); }
        .footer-author-link { color: var(--marketing-color-primary); font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .footer-author-link:hover { color: var(--marketing-color-primary-hover); text-decoration: underline; }
        .footer-lang-tag { font-size: 9px; padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(106,189,166,0.2); opacity: 0.7; }
      `}</style>

      {/* Ambient Glows preserved */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(106,189,166,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-52 w-52 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,162,97,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div
          className="mb-12 grid grid-cols-1 gap-10 pb-12 md:grid-cols-12"
          style={{ borderBottom: "1px solid var(--builder-color-border)" }}
        >
          {/* Brand Column */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <Link
              href={`${langPrefix}/`}
              className="inline-flex items-center gap-2"
            >
              <h3 className="font-serif text-2xl font-normal leading-none tracking-tight">
                {siteName.replace(".com", "")}
                <em
                  className="italic"
                  style={{ color: "var(--marketing-color-primary)" }}
                >
                  .com
                </em>
              </h3>
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed text-slate-500">
              {t(
                translations,
                "marketing.footer.about",
                "Crafting digital experiences for the moments that matter most.",
              )}
            </p>

            {/* Localized Status Badge */}
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest"
              style={{
                background: "rgba(106,189,166,0.08)",
                border: "1px solid rgba(106,189,166,0.25)",
                color: "var(--marketing-color-primary-hover)",
              }}
            >
              <span
                className="relative flex h-1.5 w-1.5 shrink-0"
                aria-hidden="true"
              >
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "var(--marketing-color-primary)" }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--marketing-color-primary)" }}
                />
              </span>
              {t(
                translations,
                "marketing.footer.production",
                "Live Production",
              )}
            </span>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* Resources Column */}
          <div className="flex flex-col gap-4 text-sm md:col-span-2">
            <h4 className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-60 text-slate-400">
              {t(translations, "marketing.footer.resources", "Resources")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a href={`${langPrefix}/faq`} className="footer-nav-link">
                {t(translations, "marketing.footer.faq", "FAQ")}
              </a>
              <a
                href={`${langPrefix}/features/multilingual-wedding-website`}
                className="footer-nav-link"
              >
                {t(
                  translations,
                  "marketing.footer.feature-multilingual",
                  "Multilingual Wedding Websites",
                )}
              </a>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-nav-link"
              >
                GitHub
              </a>
            </nav>
          </div>

          {/* Legal Column - RESTORED COOKIE POLICY */}
          <div className="flex flex-col gap-4 text-sm md:col-span-2">
            <h4 className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-60 text-slate-400">
              {t(translations, "marketing.footer.legal", "Legal")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a
                href={`${langPrefix}/privacy-policy`}
                className="footer-nav-link"
              >
                {t(translations, "marketing.legal.privacy.title", "Privacy")}
              </a>
              <a
                href={`${langPrefix}/terms-of-service`}
                className="footer-nav-link"
              >
                {t(translations, "marketing.legal.terms.title", "Terms")}
              </a>
              <a
                href={`${langPrefix}/cookie-policy`}
                className="footer-nav-link"
              >
                {t(translations, "marketing.legal.cookie.title", "Cookies")}
              </a>
            </nav>
          </div>

          {/* Languages Column */}
          <div className="flex flex-col gap-4 text-sm md:col-span-2">
            <h4 className="text-[9px] font-medium uppercase tracking-[0.2em] opacity-60 text-slate-400">
              {t(translations, "marketing.footer.languages", "Global Reach")}
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
              {SUPPORTED_LANGUAGES.map((l) => (
                <span key={l} className="footer-lang-tag">
                  {l.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Platform Entity Strip (AISEO) ──────────────────────── */}
        <section className="mb-10 flex items-start gap-4 rounded-[10px] p-6 border border-emerald-500/10 bg-emerald-500/2">
          <div
            aria-hidden="true"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="var(--marketing-color-primary)"
              strokeWidth="1.5"
            >
              <circle cx="8" cy="8" r="5.5" />
              <path d="M8 5v3l2 1.5" />
            </svg>
          </div>

          <div>
            <p className="mb-1.5 font-serif text-[10px] italic tracking-wide text-emerald-600">
              {t(
                translations,
                "marketing.footer.at_a_glance.title",
                "Platform Entity Data",
              )}
            </p>
            <p
              id="platform-summary"
              className="text-[11.5px] font-light leading-[1.8] text-slate-500"
            >
              {t(
                translations,
                "marketing.footer.at_a_glance.body",
                "WeddWeb is a 2026-native, multilingual SaaS for wedding websites. Supporting {count} languages ({list}), it enables global communication between international families through a sub-second, script-aware experience that puts privacy and technical excellence first.",
                {
                  count: SUPPORTED_LANGUAGES.length,
                  list: Object.values(SUPPORTED_LANGUAGE_LABELS).join(", "),
                },
              )}
            </p>
          </div>
        </section>

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-8 text-[10px] uppercase tracking-[0.2em] opacity-40 md:flex-row">
          <p>
            © {currentYear} {siteName}
          </p>

          <div className="flex items-center gap-4">
            <span>
              {t(translations, "marketing.footer.made_with_love", "Built by")}{" "}
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-author-link"
              >
                {author}
              </a>
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            {/* DYNAMIC ENV LABEL */}
            <span
              className="rounded font-mono text-[9px] tracking-widest px-2 py-0.5"
              style={{
                background: "rgba(106,189,166,0.07)",
                border: "1px solid rgba(106,189,166,0.18)",
                color: "var(--marketing-color-primary-hover)",
              }}
            >
              {t(translations, "marketing.footer.env_label", "ENV")}: {env}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
