import Link from "next/link";

export type LanguageToggleProps = {
  activeLang: string;
  availableLangs: string[]; // e.g. ['es', 'ca']
  basePath?: string; // e.g. "", "/program", etc - defaults to ""
  className?: string;
};

export function LanguageToggle({
  activeLang,
  availableLangs,
  basePath = "",
  className = "",
}: LanguageToggleProps) {
  return (
    <nav aria-label="Language selection" className={className}>
      <ul className="flex gap-4">
        {availableLangs.map((lang) => (
          <li key={lang}>
            <Link
              href={`/${lang}${basePath}`}
              className={`px-3 py-2 rounded font-medium 
                ${
                  lang === activeLang
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-800"
                }
                transition
              `}
              hrefLang={lang}
              prefetch={true}
              scroll={false}
            >
              {lang.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
