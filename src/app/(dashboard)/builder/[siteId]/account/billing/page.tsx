import AccountBillingDetails from "@/0-pages/(builder)/[siteId]/account/billing/AccountBillingDetails";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";

interface PageProps {
  params: { siteId: string };
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountBillingPage({
  params,
  searchParams,
}: PageProps) {
  // --- SAFELY UNWRAP searchParams ---
  let resolvedSearchParams = searchParams;

  if (
    resolvedSearchParams &&
    typeof resolvedSearchParams === "object" &&
    typeof (resolvedSearchParams as unknown as Promise<unknown>).then ===
      "function"
  ) {
    resolvedSearchParams = await (resolvedSearchParams as Promise<{
      [key: string]: string | string[] | undefined;
    }>);
  }

  // Tell TypeScript: from here on, this is the resolved object
  const paramsObj = resolvedSearchParams as
    | { [key: string]: string | string[] | undefined }
    | undefined;

  const langRaw = paramsObj?.lang;
  const lang =
    typeof langRaw === "string"
      ? langRaw
      : Array.isArray(langRaw) && typeof langRaw[0] === "string"
        ? langRaw[0]
        : "en";

  const t = await fetchBuilderTranslations(lang, "en");
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show billing page!");
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {t["billing.header"] ?? "Subscription & Billing"}
      </h1>
      <AccountBillingDetails t={t} />
    </main>
  );
}
