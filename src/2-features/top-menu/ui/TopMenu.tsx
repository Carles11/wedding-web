"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type TopMenuProps = {
  lang: string;
  translations?: TranslationDictionary | null;
};

export default function TopMenu({ lang, translations }: TopMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() ?? `/${lang}`;
  const isScrollingRef = useRef(false);

  const items = [
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

  const openLabel = translations?.["menu.open"] ?? "Open menu";
  const closeLabel = translations?.["menu.close"] ?? "Close menu";

  // Simple scroll function that works without overlay interference
  const scrollToSection = (id: string) => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    const anchor = document.getElementById(id);
    if (!anchor) {
      // If element not found, navigate to page with hash
      router.push(`/${lang}#${id}`);
      setOpen(false);
      isScrollingRef.current = false;
      return;
    }

    // Close menu first
    setOpen(false);

    // Wait for menu to close (CSS transition) before scrolling
    setTimeout(() => {
      // Get exact position
      const rect = anchor.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop;

      // Simple scroll without smooth behavior to ensure it works
      window.scrollTo(0, targetPosition);

      // Update URL hash
      const newUrl = `${window.location.pathname}#${id}`;
      window.history.replaceState({ ...window.history.state }, "", newUrl);

      // Reset scrolling flag
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }, 50); // Small delay to ensure menu is closed
  };

  // Handle click for desktop and mobile
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSection(id);
  };

  // Close menu on pathname change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  const burgerSrc = "/assets/burgerMenu/burger1.png";
  const closeSrc = "/assets/burgerMenu/burger2.png";

  return (
    <nav aria-label="Main page sections" className="flex items-center">
      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-3">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`/${lang}#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              className="text-white text-sm font-medium hover:text-blue-400 transition"
            >
              {getLabel(it.key, it.fallback)}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <div className="md:hidden">
        <button
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="p-2 text-white"
          aria-label={open ? closeLabel : openLabel}
        >
          <Image
            src={open ? closeSrc : burgerSrc}
            alt=""
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>

        {/* Mobile Menu - Simple fixed overlay */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-white text-2xl"
              aria-label={closeLabel}
            >
              <Image src={closeSrc} alt="" width={24} height={24} />
            </button>

            <nav className="w-full max-w-md px-4">
              <ul className="space-y-6">
                {items.map((it) => (
                  <li key={it.id} className="text-center">
                    <button
                      onClick={() => scrollToSection(it.id)}
                      className="text-white text-3xl font-bold py-3 w-full hover:opacity-80 transition-opacity"
                    >
                      {getLabel(it.key, it.fallback)}
                      <div className="mx-auto mt-2 h-1 w-20 bg-white/50 rounded-full" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
