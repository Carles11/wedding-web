import MarketingHeader from "@/1-widgets/marketing/ui/MarketingHeader";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SupportedLanguage } from "@/4-shared/config/i18n";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // We fetch translations once at the layout level for the common components
  const translations = await fetchMarketingTranslations(
    lang as SupportedLanguage,
    "en",
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Header is now global for all marketing pages */}
      <MarketingHeader lang={lang} translations={translations} />

      {/* 2. Main content grows to fill space */}
      <div className="flex-grow">{children}</div>

      {/* 3. Footer is now global, no more manual imports in pages! */}
      <Footer lang={lang} translations={translations} />
    </div>
  );
}
