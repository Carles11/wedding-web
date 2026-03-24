import FAQList from "@/1-widgets/marketing/ui/FAQList";
import FAQPageShell from "@/1-widgets/marketing/ui/FAQPageShell";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

import type { TranslationDictionary } from "@/4-shared/types";

export default async function FAQPage({
  params,
}: {
  params?: { lang?: string };
}) {
  const realParams = await params;
  const lang = realParams?.lang ?? "en";

  // Fetch translations
  const supabase = await createSupabaseSSRClient();
  const t: TranslationDictionary = await fetchBuilderTranslations(
    supabase,
    lang,
    "en",
  );

  return (
    <FAQPageShell
      title={t["faq.title"] ?? "Frequently Asked Questions"}
      summary={
        t["faq.summary"] ??
        "Answers to common questions about wedding websites, planning, and related services."
      }
      fine_print={
        t["faq.fine_print"] ?? "For more details or support, contact our team."
      }
    >
      <FAQList t={t} />
    </FAQPageShell>
  );
}
