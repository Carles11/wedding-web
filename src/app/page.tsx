import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";

export const dynamic = "force-dynamic";

const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

/**
 * Root page: decides whether to render marketing or tenant site,
 * always preserves query parameters (e.g. lang) in redirects.
 */
export default async function RootPage() {
  const headerList = await headers();
  const host = (headerList.get("host") ?? "").toLowerCase().trim();

  // Use x-next-url header for robust support in SSR/app router
  const nextUrl = headerList.get("x-next-url") || "/";
  const queryStart = nextUrl.indexOf("?");
  const querySuffix = queryStart !== -1 ? nextUrl.slice(queryStart) : "";

  // Marketing domain → redirect to marketing route (preserving query)
  if (MARKETING_DOMAINS.includes(host) || host === "localhost:3000") {
    redirect(`/marketing${querySuffix}`);
  }

  // Tenant domain → lookup and redirect to their default language (dynamic)
  const siteId = await getSiteIdForDomain(host);
  if (siteId) {
    const defaultLang = await getSiteDefaultLang(siteId);
    redirect(`/${defaultLang}${querySuffix}`);
  }

  // Unknown domain → fallback to marketing (preserving query)
  redirect(`/marketing${querySuffix}`);
}
