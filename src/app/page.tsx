import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";
import { MarketingLanding } from "@/4-shared/ui/marketingLanding/MarketingLanding";

const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

export default async function Page() {
  const host = ((await headers()).get("host") ?? "").toLowerCase();
  console.log("SSR_HOST:", host);

  if (MARKETING_DOMAINS.includes(host)) {
    return <MarketingLanding />;
  }

  const siteId = await getSiteIdForDomain(host);
  console.log("SSR_SITEID:", siteId);

  if (siteId) {
    const defaultLang = await getSiteDefaultLang(siteId);
    console.log("SSR DefaultLang:", defaultLang);
    redirect(`/${defaultLang}`);
  }

  // fallback: unknown domain
  return <MarketingLanding />;
}
