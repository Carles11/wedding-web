import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We leave lang as "en" here; Next.js will update the lang attribute
    // automatically if a child layout has a different lang or via metadata.
    <html>
      <body>{children}</body>
    </html>
  );
}
