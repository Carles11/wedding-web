import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";

type FooterProps = {
  author?: string;
  repoUrl?: string;
  siteName?: string;
  lang?: string;
  translations: MarketingTranslations;
};

export function Footer({
  author = "Carles11",
  repoUrl = "https://github.com/Carles11/wedding-web",
  siteName = "Rio Frances",
  lang = "",
  translations,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const langPrefix = lang ? `/${lang}` : "";

  return (
    <footer
      className="w-full py-24 px-6"
      style={{
        background: "var(--marketing-bg-subtle-gradient)",
        borderTop: "1px solid var(--builder-color-border)",
        color: "var(--marketing-color-on-gradient-text)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Section: Grid Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-left">
          {/* Brand/About Section */}
          <div className="flex flex-col gap-3">
            <h3
              className="font-bold text-lg"
              style={{ color: "var(--marketing-color-primary)" }}
            >
              {siteName}
            </h3>
            <p className="opacity-70 text-sm leading-relaxed">
              {t(
                translations,
                "marketing.footer.about",
                "Crafting digital experiences with care and precision.",
              )}
            </p>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold uppercase tracking-wider opacity-50">
              {t(translations, "marketing.footer.resources", "Resources")}
            </h4>
            <a
              href={`${langPrefix}/faq`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(translations, "marketing.footer.faq", "FAQ")}
            </a>
            <a
              href="https://www.notion.so/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4"
              target="_blank"
              rel="noopener"
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(translations, "marketing.footer.docs", "Documentation")}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener"
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(translations, "marketing.footer.github", "GitHub")}
            </a>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold uppercase tracking-wider opacity-50">
              {t(translations, "marketing.footer.legal", "Legal")}
            </h4>
            <a
              href={`${langPrefix}/privacy-policy`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(
                translations,
                "marketing.legal.privacy.title",
                "Privacy Policy",
              )}
            </a>
            <a
              href={`${langPrefix}/terms-of-service`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(
                translations,
                "marketing.legal.terms.title",
                "Terms of Service",
              )}
            </a>
            <a
              href={`${langPrefix}/cookie-policy`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {t(translations, "marketing.legal.cookie.title", "Cookie Policy")}
            </a>
          </div>
        </div>

        {/* Bottom Section: Copyright & Attribution */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>
            © {currentYear} {siteName}.{" "}
            {t(
              translations,
              "marketing.footer.copyright",
              "All rights reserved.",
            )}
          </p>

          <p>
            {t(
              translations,
              "marketing.footer.made_with_love",
              "Made with love at",
            )}{" "}
            <a
              href="https://weddweb.com"
              target="_blank"
              rel="noopener"
              className="font-semibold hover:underline"
              style={{ color: "var(--marketing-color-primary)" }}
            >
              WeddWeb
            </a>
            {" • "}
            {t(translations, "marketing.footer.powered_by", "Powered by")}{" "}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener"
              className="font-semibold hover:underline"
              style={{ color: "var(--marketing-color-primary)" }}
            >
              {author}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
