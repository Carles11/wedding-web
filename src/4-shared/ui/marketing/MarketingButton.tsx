import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type MarketingButtonVariant =
  | "primary"
  | "secondary"
  | "on-gradient"
  | "ghost"
  | "auth"
  | "auth-outline";

type MarketingButtonSize = "sm" | "md" | "lg";

/** Shared props common to both button and anchor rendering */
type BaseProps = {
  children: ReactNode;
  variant?: MarketingButtonVariant;
  size?: MarketingButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
};

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "href">;

type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type MarketingButtonProps = AsButton | AsAnchor;

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
    const { href, ...anchorRest } = rest as AsAnchor & { href: string };
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
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
