import React from "react";
import Link from "next/link";

type UnderlinedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  // color for the underline (Tailwind bg-*)
  colorClass?: string;
  /**
   * Backwards-compatible: a Tailwind height class (e.g. 'h-0.5').
   * NOTE: using a strict height class may not animate as smoothly as using max-height.
   * Prefer initialHeightClass + expandedHeightClass for the animated growth effect.
   */
  thicknessClass?: string;
  // Preferred API: initial visible thin line (using max-height for animation)
  initialHeightClass?: string; // e.g. 'max-h-[2px]'
  // Preferred API: expanded max-height on hover/focus
  expandedHeightClass?: string; // e.g. 'group-hover:max-h-[10px] group-focus:max-h-[10px]'
  durationMs?: number;
  external?: boolean;
  ariaLabel?: string;
  prefetch?: boolean;
};

export default function UnderlinedLink({
  href,
  children,
  className = "",
  colorClass = "bg-sky-200",
  thicknessClass = "", // kept for compatibility
  initialHeightClass = "max-h-[2px]",
  expandedHeightClass = "group-hover:max-h-[8px] group-focus:max-h-[8px]",
  durationMs = 300,
  external = false,
  ariaLabel,
  prefetch,
}: UnderlinedLinkProps) {
  const rel = external ? "noopener noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  const underlineStyle: React.CSSProperties = {
    transitionProperty: "max-height, opacity",
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: "cubic-bezier(.2,.9,.2,1)",
  };

  const baseClass =
    "group inline-block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded " +
    className;

  // Both thicknessClass (legacy) and initialHeightClass (preferred) are applied.
  // initialHeightClass uses max-height to animate the "growing" effect upward.
  const underlineClasses = `absolute left-0 right-0 bottom-0 ${colorClass} z-0 overflow-hidden ${thicknessClass} ${initialHeightClass} ${expandedHeightClass}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>

      <span
        aria-hidden="true"
        className={underlineClasses}
        style={underlineStyle}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={baseClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={ariaLabel}
      className={baseClass}
    >
      {content}
    </Link>
  );
}
