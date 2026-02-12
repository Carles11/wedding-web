import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";

export const dynamic = "force-dynamic";

const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

export default async function RootPage() {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();

  console.log("🔍 [RootPage] Host:", host);

  // Marketing domain → redirect to marketing route
  if (MARKETING_DOMAINS.includes(host) || host === "localhost:3000") {
    console.log("✅ [RootPage] Marketing domain detected");
    redirect("/marketing");
  }

  // Tenant domain → lookup site and redirect to default language
  console.log("🔍 [RootPage] Looking up tenant site for:", host);
  const siteId = await getSiteIdForDomain(host);
  console.log("🔍 [RootPage] Site ID found:", siteId);

  if (siteId) {
    const defaultLang = await getSiteDefaultLang(siteId);
    console.log("✅ [RootPage] Redirecting to:", `/${defaultLang}`);
    redirect(`/${defaultLang}`);
  }

  // Unknown domain → show marketing page
  console.log("❌ [RootPage] No site found, showing marketing fallback");
  redirect("/marketing");
}
