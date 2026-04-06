import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Auth Layout — Defense-in-Depth Noindex Layer
 *
 * This layout acts as the SECONDARY safety net for all auth routes,
 * covering every page under /[lang]/auth/ regardless of whether the
 * individual page exports its own generateMetadata.
 *
 * Layer 1: robots.ts  → Disallow /* /auth/ for all crawlers (robots.txt)
 * Layer 2: This layout → X-Robots-Tag: noindex via exported metadata
 * Layer 3: Each page  → generateMetadata with robots: { index: false, ... }
 *
 * Together these ensure that no auth page is ever indexed, even if a future
 * page is added without an explicit noindex directive.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
