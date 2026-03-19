"use server";

import AccountPage from "@/0-pages/(builder)/account/AccountPage";
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";

export default async function AccountPageSSR({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const resolvedParams = (await resolveSearchParams(searchParams)) ?? {};
  let langCandidate = resolvedParams.lang;

  if (Array.isArray(langCandidate)) langCandidate = langCandidate[0];
  const resolvedLang = resolveLanguageFromParams(
    typeof langCandidate === "string" ? langCandidate : undefined,
    resolvedParams,
    isValidLanguage,
  );

  const translations = await fetchBuilderTranslations(
    resolvedLang || "en",
    "en",
  );

  // Fetch account info server-side (stub userId for demo)
  const account = await getAccountInfo();

  return <AccountPage account={account} translations={translations} />;
}
