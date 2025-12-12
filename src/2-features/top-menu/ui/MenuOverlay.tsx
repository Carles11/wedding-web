"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type MenuItem = { id: string; key: string; fallback: string };

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  lang: string;
  translations?: TranslationDictionary | null;
  onItemClick: (
    e: React.MouseEvent,
    id: string,
    isMobileOverlay?: boolean
  ) => Promise<void> | void;
};

export default function MenuOverlay({
  open,
  onClose,
  items,
  lang,
  translations,
  onItemClick,
}: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const getLabel = (k: string, fallback: string) =>
    translations?.[k] ?? fallback;

  const restoreBodyStyles = () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  };

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      isClosingRef.current = false;
    } else {
      restoreBodyStyles();
    }

    return () => {
      restoreBodyStyles();
    };
  }, [open]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    onClose();
  };

  // Trap focus inside dialog
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const handleItemClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // First, visually hide the overlay
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.pointerEvents = "none";
    }

    // Restore body scroll immediately so page can scroll
    restoreBodyStyles();

    // Small delay to ensure overlay animation starts
    requestAnimationFrame(async () => {
      try {
        // Call the scroll function with isMobileOverlay flag
        await onItemClick(e, id, true);

        // Close the overlay after scroll completes
        setTimeout(() => {
          onClose();
        }, 300);
      } catch (error) {
        console.error("Error during navigation:", error);
        onClose();
      }
    });
  };

  if (!open) return null;

  const closeIconSrc = "/assets/burgerMenu/burger2.png";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Centered menu content - prevent clicks inside from closing */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label={translations?.["menu.close"] ?? "Close menu"}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none transition-transform hover:scale-110 z-20"
        >
          <Image
            src={closeIconSrc}
            alt={translations?.["menu.close"] ?? "Close menu"}
            width={24}
            height={24}
            className="object-contain"
          />
        </button>

        <nav className="w-full max-w-3xl px-4">
          <ul className="flex flex-col items-center gap-6">
            {items.map((it) => (
              <li key={it.id} className="w-full">
                <button
                  type="button"
                  onClick={(e) => handleItemClick(e, it.id)}
                  className="w-full text-center text-white text-3xl sm:text-4xl font-bold py-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
                  aria-label={getLabel(it.key, it.fallback)}
                >
                  <span className="block">{getLabel(it.key, it.fallback)}</span>
                  <span className="block mx-auto mt-2 h-1 w-24 bg-white/60 rounded-full" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
