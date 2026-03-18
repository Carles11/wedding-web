import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  // Add shared header, footer, or styling here if needed
  return (
    <div>
      {/* Shared marketing header can go here */}
      {children}
      {/* Shared marketing footer can go here */}
    </div>
  );
}
