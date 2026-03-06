import { getCurrentUserSubscription } from "@/4-shared/api/builder/getCurrentUserSubscription";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (!userData) {
    throw new Error("Not authenticated: cannot upload image!");
  }
  const user = userData?.user;
  // Subscription: lookup for this user (you can also make tenant-aware if needed)
  let subscriptionType: string | null = null;
  if (user) {
    subscriptionType = await getCurrentUserSubscription(user.id);
  }

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
          {user ? (
            <div className="space-y-4">
              <p>
                {t["billing.subscription_type"] ?? "Current Plan"}:{" "}
                <span className="font-semibold capitalize">
                  {subscriptionType ?? t["billing.none"] ?? "None"}
                </span>
              </p>
              {/* Future: add/change buttons, more info, usage stats, etc */}
            </div>
          ) : (
            <p className="text-red-600">
              {t["billing.login_required"] ??
                "You must be logged in to see your subscription details."}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
