import CheckoutClient from "@/0-pages/(builder)/checkout/CheckoutClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";

type CheckoutPageProps = {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
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
  const langCandidate =
    typeof langRaw === "string"
      ? langRaw
      : Array.isArray(langRaw) && typeof langRaw[0] === "string"
        ? langRaw[0]
        : "en";

  const lang = isValidLanguage(langCandidate) ? langCandidate : "en";
  const t = await fetchBuilderTranslations(lang, "en");

  return <CheckoutClient t={t} lang={lang} />;
}
