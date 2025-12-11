// 4-shared/ui/typography/Heading.tsx
import React from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Polymorphic, typed Heading component.
 * - as: explicit tag, e.g. "h1", "h2"...
 * - level: convenience prop to set the tag (level={1} -> h1)
 * Other props are inferred from the chosen tag (so <Heading as="h3" id="x"> works with correct props).
 */
export function Heading<T extends React.ElementType = "h2">({
  as,
  level,
  className,
  children,
  ...rest
}: {
  as?: T;
  level?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">) {
  // Resolve tag from `as` or `level`, default to "h2"
  const Tag = (as ?? (level ? (`h${level}` as T) : ("h2" as T))) as T;

  const classes = ["heading", className].filter(Boolean).join(" ");

  // Tag is a local variable, no import required — React accepts a variable element name
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line (we already constrained types above)
    <Tag className={classes} {...(rest as React.ComponentPropsWithoutRef<T>)}>
      {children}
    </Tag>
  );
}

export default Heading;
