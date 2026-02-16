import { redirect } from "next/navigation";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import BuilderClient from "./BuilderClient";

const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
  "ca",
  "ar",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
];
function isValidLanguage(lang: string | undefined): lang is string {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang);
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const requested = params?.lang;

  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchBuilderTranslations(lang, "en");

  return <BuilderClient initialLang={lang} translations={translations} />;
}
