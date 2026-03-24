export function Footer({
  author = "Carles11",
  repoUrl = "https://github.com/Carles11",
  siteName = "Rio Frances",
  lang = "",
}) {
  const currentYear = new Date().getFullYear();
  const langPrefix = lang ? `/${lang}` : "";

  return (
    <footer
      className="w-full py-12 px-6"
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
              Crafting digital experiences with care and precision.
            </p>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold uppercase tracking-wider opacity-50">
              Resources
            </h4>
            <a
              href={`${langPrefix}/faq`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              FAQ
            </a>
            <a
              href={`${langPrefix}/docs`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              Documentation
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener"
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              GitHub
            </a>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold uppercase tracking-wider opacity-50">
              Legal
            </h4>
            <a
              href={`${langPrefix}/privacy`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              Privacy Policy
            </a>
            <a
              href={`${langPrefix}/terms`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              Terms of Service
            </a>
            <a
              href={`${langPrefix}/cookies`}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Bottom Section: Copyright & Attribution */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>
            © {currentYear} {siteName}. All rights reserved.
          </p>

          <p>
            Made with love at{" "}
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
            Powered by{" "}
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
