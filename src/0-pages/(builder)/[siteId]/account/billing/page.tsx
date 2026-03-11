import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import AccountBillingDetails from "./AccountBillingDetails";

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

  // Auth: SSR-aware
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show billing page!");
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
          {/* Now, use a widget/component that uses the usePlan() hook */}
          <AccountBillingDetails t={t} />
        </main>
      </body>
    </html>
  );
}
