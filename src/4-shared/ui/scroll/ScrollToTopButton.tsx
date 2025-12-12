"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

/**
 * ScrollToTopButton
 * - Appears after user scrolls past `showAfter` px (default 240)
 * - Smooth-scrolls to top, respects prefers-reduced-motion
 * - Accessible: aria-label, visible focus ring, keyboard operable
 * - Styling: dark circle with opacity, centered white arrow (SVG)
 */
type Props = {
  showAfter?: number; // pixels scrolled before showing button
  right?: string; // CSS right offset (Tailwind-friendly value or px)
  bottom?: string; // CSS bottom offset
  size?: number; // diameter in px
  className?: string;
  title?: string;
};

export default function ScrollToTopButton({
  showAfter = 240,
  right = "1rem",
  bottom = "1.25rem",
  size = 48,
  className = "",
  title = "Scroll to top",
}: Props) {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lastScrollRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onScroll() {
      const y = window.scrollY ?? window.pageYOffset ?? 0;
      lastScrollRef.current = y;
      setVisible(y > showAfter);
    }

    // run once to set initial state
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  const handleClick = useCallback(() => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    // smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [prefersReducedMotion]);

  // keyboard handler for Enter/Space when focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // Inline styles for positioning and size (so consumers can pass tailwind-less offsets)
  const style: React.CSSProperties = {
    right,
    bottom,
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div aria-hidden={!visible} className={className}>
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={title}
        aria-label={title}
        className={`fixed z-[9999] flex items-center justify-center rounded-full bg-black/70 text-white shadow-lg
          transition-opacity duration-200 ease-in-out transform-gpu
          ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent`}
        style={style}
      >
        {/* Up arrow SVG (semantic, scalable) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size * 0.48}
          height={size * 0.48}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 4v16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10l6-6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

/**
 * Hook: prefers-reduced-motion
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    )
      return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    )
      return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (ev: MediaQueryListEvent) => setPrefersReduced(ev.matches);
    // matchMedia.addEventListener is not available in older Safari; fallback
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      // legacy fallback for older Safari
      mq.addListener(handler);
      return () => {
        // legacy fallback for older Safari
        mq.removeListener(handler);
      };
    }
  }, []);

  return prefersReduced;
}
