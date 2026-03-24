import FAQList from "@/1-widgets/marketing/ui/FAQList";
import FAQPageShell from "@/1-widgets/marketing/ui/FAQPageShell";
import MarketingFloatingLanguageSelector from "@/1-widgets/marketing/ui/MarketingFloatingLanguageSelector";
import { MarketingTranslations } from "@/4-shared/types/marketingPage";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function FAQPage({ translations, lang }: Props) {
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
        {translations["auth.common.back_to_home"] || "Back"}
      </UnderlinedLink>
      <MarketingFloatingLanguageSelector
        currentLang={lang}
        label={translations["marketing.lang_selector.label"]}
      />
      <FAQPageShell
        title={
          translations["marketing.faq.title"] ?? "Frequently Asked Questions"
        }
        summary={
          translations["marketing.faq.summary"] ??
          "Answers to common questions about wedding websites, planning, and related services."
        }
        fine_print={
          translations["marketing.faq.fine_print"] ??
          "For more details or support, contact our team."
        }
      >
        <FAQList t={translations} />
      </FAQPageShell>
    </>
  );
}
