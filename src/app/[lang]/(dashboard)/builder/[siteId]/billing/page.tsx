import AccountBillingPage from "@/0-pages/(builder)/domain-billing/AccountBillingPage";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; siteId: string }>;
}

export default async function BillingPage({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams?.lang) return notFound();
  const lang = isValidLanguage(resolvedParams.lang)
    ? resolvedParams.lang
    : "en";

  return <AccountBillingPage lang={lang} />;
}
