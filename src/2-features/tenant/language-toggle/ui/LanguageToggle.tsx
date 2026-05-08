"use client";

import { LanguageToggleProps } from "@/4-shared/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LanguageToggle({
  activeLang,
  availableLangs,
  basePath = "",
  className = "",
}: LanguageToggleProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const langs = Array.isArray(availableLangs) ? availableLangs : [];
  const showCompactMobile = langs.length > 2;

  useEffect(() => {
    if (!mobileOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const target = event.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [mobileOpen]);

  if (langs.length <= 1) return null;

  return (
    <nav aria-label="Language selection" className={className}>
      {showCompactMobile ? (
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Change language"
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center gap-2 rounded-lg border border-white/25 bg-black/35 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm"
          >
            <span>{activeLang.toUpperCase()}</span>
            <span className="text-[10px] leading-none">▾</span>
          </button>

          {mobileOpen && (
            <ul className="md:hidden absolute right-0 mt-2 w-16 rounded-xl border border-white/20 bg-black/75 p-1.5 shadow-xl backdrop-blur-md">
              {langs.map((lang) => (
                <li key={lang}>
                  <Link
                    href={`/${lang}${basePath}`}
                    hrefLang={lang}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-2.5 py-1.5 text-right text-xs font-medium transition ${
                      lang === activeLang
                        ? "underline text-white/90 pb-1.5 decoration-2 decoration-white/90 underline-offset-4"
                        : "text-white/90 hover:bg-white/15"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <ul className="hidden md:flex md:flex-wrap md:justify-end gap-2">
            {langs.map((lang) => (
              <li key={lang}>
                <Link
                  href={`/${lang}${basePath}`}
                  className={`px-2.5 py-1.5 rounded font-medium text-sm transition ${
                    lang === activeLang
                      ? "bg-neutral-900 text-white underline decoration-2 underline-offset-4"
                      : "bg-transparent text-white/85 hover:text-white"
                  }`}
                  hrefLang={lang}
                  prefetch={true}
                >
                  {lang.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="flex gap-3">
          {langs.map((lang) => (
            <li key={lang}>
              <Link
                href={`/${lang}${basePath}`}
                className={`px-3 py-2 rounded font-medium transition ${
                  lang === activeLang
                    ? "bg-neutral-900 text-white underline decoration-2 underline-offset-4"
                    : "bg-transparent text-white/80"
                }`}
                hrefLang={lang}
                prefetch={true}
              >
                {lang.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
