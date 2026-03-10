"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { TranslationDictionary } from "@/4-shared/types";
import MenuOverlay from "./MenuOverlay";

type TopMenuProps = {
  lang: string;
  translations?: TranslationDictionary | null;
};

export default function TopMenu({ lang, translations }: TopMenuProps) {
  const [open, setOpen] = useState(false);

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

  const handleItemClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Close menu immediately
    setOpen(false);

    // Wait a bit for menu to close
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Use instant scroll
        element.scrollIntoView({ behavior: "smooth" });

        // Update URL
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}#${id}`,
        );
      }
    }, 10);
  };

  const burgerSrc = "/assets/burgerMenu/burger1.png";
  const closeSrc = "/assets/burgerMenu/burger2.png";
  const openLabel = translations?.["menu.open"] ?? "Open menu";
  const closeLabel = translations?.["menu.close"] ?? "Close menu";

  return (
    <nav aria-label="Main page sections" className="flex items-center">
      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-3">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(it.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
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
          onClick={() => setOpen(!open)}
          className="p-2 text-white hover:opacity-80 transition-opacity"
          aria-label={open ? closeLabel : openLabel}
          aria-expanded={open}
        >
          <Image
            src={open ? closeSrc : burgerSrc}
            alt=""
            width={20}
            height={20}
          />
        </button>

        {/* Use MenuOverlay component */}
        <MenuOverlay
          open={open}
          onClose={() => setOpen(false)}
          items={items}
          lang={lang}
          translations={translations}
          onItemClick={handleItemClick}
        />
      </div>
    </nav>
  );
}
