export function WeddWebBadge() {
  return (
    <div className="absolute bottom-4 md:bottom-8 inset-e-4 md:inset-e-8 z-50">
      <span
        className="text-xs text-gray-300 dark:text-gray-400 px-3 py-1 rounded shadow border border-gray-200 dark:border-gray-700 font-semibold select-none backdrop-blur bg-white/10 dark:bg-gray-900/80"
        style={{ letterSpacing: "0.04em" }}
      >
        Powered by{" "}
        <a
          href="https://weddweb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--marketing-color-primary) hover:opacity-80 focus-visible:ring cursor-pointer"
          title="WeddWeb – Multilingual Wedding Website Platform"
        >
          WeddWeb
        </a>
      </span>
    </div>
  );
}
