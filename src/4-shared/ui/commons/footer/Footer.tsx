export function Footer({
  author = "Carles11",
  repoUrl = "https://github.com/Carles11",
  siteName = "Rio Frances",
}) {
  return (
    <footer
      className="w-full py-8 text-center text-sm"
      style={{
        background: "var(--marketing-bg-subtle-gradient)",
        borderTop: "1px solid var(--builder-color-border)",
        color: "var(--marketing-color-on-gradient-text)",
      }}
    >
      <span className="opacity-70">
        © {new Date().getFullYear()} made with love at{" "}
        <a
          href="https://weddweb.com"
          rel="noopener"
          target="_blank"
          className="font-semibold transition-opacity hover:opacity-100"
          style={{ color: "var(--marketing-color-primary)" }}
        >
          {siteName}
        </a>
        {" · "}
        Powered by{" "}
        <a
          href={repoUrl}
          rel="noopener"
          target="_blank"
          className="font-semibold transition-opacity hover:opacity-100"
          style={{ color: "var(--marketing-color-primary)" }}
        >
          {author}
        </a>
      </span>
    </footer>
  );
}
