export function Footer({
  author = "Carles11",
  repoUrl = "https://github.com/Carles11",
  siteName = "Rio Frances",
}) {
  return (
    <footer className="w-full py-6 text-center text-sm text-gray-600 bg-gray-100 border-t mt-8">
      <span>
        © {new Date().getFullYear()} {siteName}. Site by{" "}
        <a
          href={repoUrl}
          rel="noopener"
          target="_blank"
          className="text-blue-700 underline hover:text-blue-900 font-semibold"
        >
          {author}
        </a>
        .
      </span>
    </footer>
  );
}
