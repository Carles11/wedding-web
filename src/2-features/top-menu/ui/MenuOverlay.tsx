"use client";

import React, { useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type MenuItem = { id: string; key: string; fallback: string };

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  lang: string;
  translations?: TranslationDictionary | null;
  // Reuse the TopMenu.handleClick signature (it may close the menu itself).
  onItemClick: (
    e: React.MouseEvent,
    id: string,
    isMobileOverlay?: boolean
  ) => Promise<void> | void;
};

/**
 * Full-screen menu overlay (portal)
 * - Renders into document.body to avoid stacking-context/transform issues
 * - Uses a very high z-index so it sits above header badges
 * - Locks body scroll while open and restores it on close
 * - Focus-trap + Escape to close
 * - Calls onItemClick(e, id, true) and then triggers onClose() after a small hide animation
 */
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

  // Create portal container once on client
  const container = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.createElement("div");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Append / remove portal container to body when open changes
  useEffect(() => {
    if (!container) return;
    if (open) {
      document.body.appendChild(container);
    }
    return () => {
      if (container.parentNode === document.body) {
        document.body.removeChild(container);
      }
    };
  }, [open, container]);

  // Body scroll lock while overlay is open
  const restoreBodyStyles = () => {
    try {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      // lock scrolling
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

  // Focus trap + Escape handling
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!isClosingRef.current) onClose();
        return;
      }

      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // focus first element when opened
    const t = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  // Prevent double-close
  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onClose();
  };

  // When an item is clicked we:
  // - prevent default
  // - start a short hide animation
  // - restore body scrolling
  // - call the provided onItemClick with (e, id, true)
  // - finally call onClose() after a short timeout to allow animation
  const handleItemClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // start hide animation (fade out)
    if (overlayRef.current) {
      overlayRef.current.style.transition =
        "opacity 220ms ease, transform 220ms ease";
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.transform = "scale(0.995)";
      overlayRef.current.style.pointerEvents = "none";
    }

    // restore body scroll to allow scrolling during/after navigation
    restoreBodyStyles();

    // Next frame: run navigation
    requestAnimationFrame(async () => {
      try {
        await onItemClick(e, id, true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("MenuOverlay onItemClick error:", err);
      } finally {
        // ensure the overlay actually closes after a small timeout so animation is visible
        setTimeout(() => {
          onClose();
        }, 220);
      }
    });
  };

  if (!container || !open) return null;

  const closeIconSrc = "/assets/burgerMenu/burger2.png";

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ opacity: 1, pointerEvents: "auto" }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Centered dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={translations?.["menu.nav"] ?? "Main menu"}
        className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close control */}
        <button
          onClick={handleClose}
          aria-label={translations?.["menu.close"] ?? "Close menu"}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/60 focus:outline-none transition-transform hover:scale-110 z-20"
        >
          <Image
            src={closeIconSrc}
            alt={translations?.["menu.close"] ?? "Close menu"}
            width={24}
            height={24}
            className="object-contain"
          />
        </button>

        {/* Large centered menu */}
        <nav className="w-full max-w-3xl">
          <ul className="flex flex-col items-center gap-8">
            {items.map((it) => (
              <li key={it.id} className="w-full">
                <a
                  href={`/${lang}#${it.id}`}
                  role="menuitem"
                  aria-label={getLabel(it.key, it.fallback)}
                  onClick={(e) => handleItemClick(e as React.MouseEvent, it.id)}
                  className="block w-full text-center text-white text-3xl sm:text-4xl md:text-5xl font-semibold py-4 px-6 hover:opacity-95 transition-opacity rounded-lg"
                >
                  <span className="block leading-tight">
                    {getLabel(it.key, it.fallback)}
                  </span>
                  <span
                    className="block mx-auto mt-3 h-1 w-24 bg-white/60 rounded-full"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>,
    container
  );
}
