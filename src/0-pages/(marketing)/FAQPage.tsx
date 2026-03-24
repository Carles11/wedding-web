import FAQList from "@/1-widgets/marketing/ui/FAQList";
import FAQPageShell from "@/1-widgets/marketing/ui/FAQPageShell";
import MarketingFloatingLanguageSelector from "@/1-widgets/marketing/ui/MarketingFloatingLanguageSelector";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing/getTranslations";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";

export default async function FAQPage({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const realParams = await params;
  const lang = realParams?.lang ?? "en";

  // Fetch translations

  const newTranslations = await fetchMarketingTranslations(lang, "en");
  return (
    <>
      <UnderlinedLink
        href={`/${lang?.toLowerCase() || "en"}/`}
        thicknessClass="h-0.5"
        durationMs={350}
        ariaLabel={"Back to dashboard"}
        fixed={true}
        className="left-4 top-4"
      >
        {newTranslations["auth.common.back_to_home"] || "Back"}
      </UnderlinedLink>
      <MarketingFloatingLanguageSelector
        currentLang={lang}
        label={newTranslations["marketing.lang_selector.label"]}
      />
      <FAQPageShell
        title={
          newTranslations["marketing.faq.title"] ?? "Frequently Asked Questions"
        }
        summary={
          newTranslations["marketing.faq.summary"] ??
          "Answers to common questions about wedding websites, planning, and related services."
        }
        fine_print={
          newTranslations["marketing.faq.fine_print"] ??
          "For more details or support, contact our team."
        }
      >
        <FAQList t={newTranslations} />
      </FAQPageShell>
    </>
  );
}
