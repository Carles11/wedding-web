import { getCurrentUserSubscription } from "@/4-shared/api/builder/getCurrentUserSubscription";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { usePlan } from "@/app/providers";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";

interface PageProps {
  params: { siteId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AccountBillingPage({
  params,
  searchParams,
}: PageProps) {
  // Language resolution
  const lang =
    typeof searchParams?.lang === "string" ? searchParams.lang : "en";
  const siteId = typeof params?.siteId === "string" ? params.siteId : "";

  const t = await getMergedTranslations(siteId, lang, "en");
  const supabase = await createSupabaseSSRClient();

  // Auth: SSR-aware
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show billing page!");
  }

  // NEW: Get the full subscription object
  const subscription =
    user != null ? await getCurrentUserSubscription(user.id) : null;
  console.log("User subscription in page component:", subscription);
  // Render
  return (
    <html lang={lang}>
      <head>
        <title>{t["billing.page.title"] ?? "Billing & Subscription"}</title>
        <meta
          name="description"
          content={
            t["billing.page.desc"] ??
            "Manage your subscription and billing for your event website."
          }
        />
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <main className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">
            {t["billing.header"] ?? "Subscription & Billing"}
          </h1>
          {/* Now, use a widget/component that uses the usePlan() hook */}
          <AccountBillingDetails t={t} />
        </main>
      </body>
    </html>
  );
}

// Example detail widget using usePlan (you can separate into its own file)

function AccountBillingDetails({ t }: { t: Record<string, string> }) {
  const { planType, features, subscription } = usePlan();

  return (
    <div className="space-y-4">
      <p>
        {t["billing.subscription_type"] ?? "Current Plan"}:{" "}
        <span className="font-semibold capitalize">
          {planType ?? t["billing.none"] ?? "None"}
        </span>
      </p>
      {/* You can show more info, usage stats, or plan features here */}
    </div>
  );
}
