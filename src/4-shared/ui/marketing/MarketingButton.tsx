import {
  AsAnchor,
  AsButton,
  MarketingButtonProps,
  MarketingButtonVariant,
} from "@/4-shared/types";
import Link from "next/link";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Auth variants have their own padding defined in CSS, so skip the size class. */
const AUTH_VARIANTS: MarketingButtonVariant[] = ["auth", "auth-outline"];

export function MarketingButton(props: MarketingButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    loadingLabel = "Loading...",
    className,
    ...rest
  } = props;

  const variantClass = {
    primary: "marketing-btn-primary",
    secondary: "marketing-btn-secondary",
    "on-gradient": "marketing-btn-on-gradient",
    ghost: "marketing-btn-ghost",
    auth: "marketing-btn-auth",
    "auth-outline": "marketing-btn-auth-outline",
  }[variant];

  const sizeClass = AUTH_VARIANTS.includes(variant)
    ? undefined
    : `marketing-btn-${size}`;

  const classes = joinClasses(
    "marketing-btn",
    variantClass,
    sizeClass,
    fullWidth && "w-full",
    className,
  );

  const content = loading ? loadingLabel : children;

  if ("href" in rest) {
    const { href, ...anchorRest } = rest as AsAnchor;

    // If it's an external link (like your .dog demo), use a standard <a>
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type, disabled, ...buttonRest } = rest as AsButton;
  return (
    <button
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
