import { ReactNode } from "react";
import "../globals.css";

export default function LangLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
