import { ReactNode } from "react";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <div className="marketing-theme">{children}</div>;
}
