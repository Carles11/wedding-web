import { ButtonHTMLAttributes, ReactNode } from "react";

type BuilderButtonVariant = "primary" | "secondary";
type BuilderButtonSize = "sm" | "md";
type BuilderButtonTone = "default" | "danger";

type BuilderButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  variant?: BuilderButtonVariant;
  size?: BuilderButtonSize;
  tone?: BuilderButtonTone;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BuilderButton({
  children,
  variant = "primary",
  size = "md",
  tone = "default",
  fullWidth = false,
  loading = false,
  loadingLabel = "Saving...",
  className,
  disabled,
  type = "button",
  ...rest
}: BuilderButtonProps) {
  const variantClass =
    variant === "primary"
      ? "builder-btn-primary"
      : tone === "danger"
        ? "builder-btn-secondary-danger"
        : "builder-btn-secondary";

  const sizeClass = size === "sm" ? "builder-btn-sm" : "builder-btn-md";

  return (
    <button
      type={type}
      className={joinClasses(
        "builder-btn",
        variantClass,
        sizeClass,
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
