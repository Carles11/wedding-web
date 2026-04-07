import { LanguageToggleProps } from "@/4-shared/types";
import Link from "next/link";

export function LanguageToggle({
  activeLang,
  availableLangs,
  basePath = "",
  className = "",
}: LanguageToggleProps) {
  return (
    <nav aria-label="Language selection" className={className}>
      <ul className="flex gap-4">
        {availableLangs &&
          availableLangs.length > 1 &&
          availableLangs.map((lang) => (
            <li key={lang}>
              <Link
                href={`/${lang}${basePath}`}
                className={`px-3 py-2 rounded font-medium 
                ${
                  lang === activeLang
                    ? "bg-neutral-900 text-white underline decoration-2 underline-offset-4"
                    : "bg-transparent text-white/80"
                }
                transition
              `}
                hrefLang={lang}
                prefetch={true}
                // Remove scroll={false} to scroll to top on language change
              >
                {lang.toUpperCase()}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
