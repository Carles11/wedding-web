import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import AccountBillingDetails from "./ui/AccountBillingDetails";

export default async function AccountBillingPage({ lang }: { lang: string }) {
  const supabase = await createSupabaseSSRClient();
  const t = await fetchBuilderTranslations(supabase, lang, "en");
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show billing page!");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">
              {(user.email?.[0] ?? "U").toUpperCase()}
            </span>
          </div>
          <div>
            <Heading as="h1" className="text-lg font-semibold text-gray-900">
              {t["billing.header"] ?? "Subscription & Billing"}
            </Heading>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <AccountBillingDetails translations={t} lang={lang} />
      </div>
    </div>
  );
}
