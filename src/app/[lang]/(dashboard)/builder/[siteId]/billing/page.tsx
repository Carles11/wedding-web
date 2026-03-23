import AccountBillingPage from "@/0-pages/(builder)/domain-billing/AccountBillingPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; siteId: string }>;
}

export default async function BillingPage({ params }: PageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.lang || !resolvedParams?.siteId) return notFound();
  return (
    <AccountBillingPage
      params={{ siteId: resolvedParams.siteId, lang: resolvedParams.lang }}
    />
  );
}
