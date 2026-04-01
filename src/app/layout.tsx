import { allFontInstances } from "@/4-shared/lib/fonts/fontRegistry";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVariables = allFontInstances.map((f) => f.variable).join(" ");

  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
