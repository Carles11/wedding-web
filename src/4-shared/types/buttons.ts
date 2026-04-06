import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type MarketingButtonVariant =
  | "primary"
  | "secondary"
  | "on-gradient"
  | "ghost"
  | "auth"
  | "auth-outline";

export type MarketingButtonSize = "sm" | "md" | "lg";

/** Shared props common to both button and anchor rendering */
export type BaseProps = {
  children: ReactNode;
  variant?: MarketingButtonVariant;
  size?: MarketingButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
};

export type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "href">;

export type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type MarketingButtonProps = AsButton | AsAnchor;
