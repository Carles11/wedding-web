/**
 * Lang Layout — src/app/[lang]/layout.tsx
 *
 * Wraps all language routes (/en/, /es/, /ar/, etc.).
 *
 * IMPORTANT: <html> and <body> have been moved to src/app/layout.tsx
 * (the true root layout). This layout must NOT re-render those tags.
 * It renders only what is specific to language routes:
 * - Structured data (JSON-LD graph schema)
 * - Analytics with consent banner
 */
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import { AnalyticsWithConsent } from "@/4-shared/ui/AnalyticsWithConsent";
import { ReactNode } from "react";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";

  return (
    <>
      <JsonLd data={generateGraphSchema({}, lang)} />
      {children}
      <AnalyticsWithConsent lang={lang} />
    </>
  );
}
