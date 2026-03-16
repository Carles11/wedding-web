import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import AccountBillingDetails from "./AccountBillingDetails";

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold">
              {(user.email?.[0] ?? "U").toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {t["billing.header"] ?? "Subscription & Billing"}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <AccountBillingDetails t={t} />
      </div>
    </div>
  );
}
