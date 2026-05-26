/**
 * Root Layout — minimal shell for the root route (/).
 *
 * This layout ONLY wraps src/app/page.tsx (the SEO bot landing page).
 * All language routes (/en/, /es/, etc.) use src/app/[lang]/layout.tsx
 * which provides its own <html> and <body> with lang/dir attributes.
 *
 * Do NOT add marketing components, client-side logic, or heavy imports here.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
