"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type TopMenuProps = {
  lang: string;
  translations?: TranslationDictionary | null;
};

/**
 * TopMenu
 * - Client component for left-top menu, responsive (hamburger on mobile)
 * - Uses translations passed from server; falls back to English labels.
 * - Smooth scrolls to anchors with matching ids on the same page (/{lang}#anchor)
 */
export default function TopMenu({ lang, translations }: TopMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() ?? `/${lang}`;

  // Menu items: id = anchor id used within the page
  const items: { id: string; key: string; fallback: string }[] = [
    { id: "details", key: "menu.details", fallback: "Details" },
    {
      id: "accommodation",
      key: "menu.accommodation",
      fallback: "Accommodation",
    },
    { id: "whatelse", key: "menu.what_else", fallback: "What else" },
    { id: "contact", key: "menu.contact", fallback: "Contact" },
  ];

  const getLabel = (k: string, fallback: string) =>
    translations?.[k] ?? fallback;

  function updateUrlHash(id: string) {
    if (typeof window !== "undefined") {
      const newUrl = `${pathname.split("#")[0]}#${id}`;
      history.replaceState(null, "", newUrl);
    }
  }

  async function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setOpen(false);

    // Try to scroll to the element if it exists on the page
    const anchor = document.getElementById(id);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
      updateUrlHash(id);
      return;
    }

    // Otherwise navigate to language-prefixed page with the hash
    router.push(`/${lang}#${id}`);
  }

  return (
    <nav aria-label="Main page sections" className="flex items-center">
      {/* Desktop / md+ : horizontal links */}
      <ul className="hidden md:flex items-center gap-3">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`/${lang}#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              className="text-white text-sm font-medium  hover:text-blue-400 transition"
            >
              {getLabel(it.key, it.fallback)}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile: hamburger */}
      <div className="md:hidden relative">
        <button
          aria-expanded={open}
          aria-controls="topmenu-mobile"
          onClick={() => setOpen((s) => !s)}
          className="p-2 rounded-md inline-flex items-center justify-center text-white hover:bg-neutral-100"
          title="Open menu"
        >
          {/* hamburger icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            id="topmenu-mobile"
            role="menu"
            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50"
          >
            <ul className="flex flex-col py-2">
              {items.map((it) => (
                <li key={it.id}>
                  <a
                    role="menuitem"
                    href={`/${lang}#${it.id}`}
                    onClick={(e) => handleClick(e, it.id)}
                    className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
                  >
                    {getLabel(it.key, it.fallback)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
