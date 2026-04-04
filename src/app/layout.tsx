import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { allFontInstances } from "@/4-shared/lib/fonts/fontRegistry";
import "./globals.css";

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const fontVariables = allFontInstances.map((f) => f.variable).join(" ");
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";
  return (
    <html lang={lang}>
      <head>
        {/* AI & LLM discovery — allows agents to find structured platform docs */}
        <link rel="alternate" type="text/plain" href="/llms.txt" />
      </head>
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
