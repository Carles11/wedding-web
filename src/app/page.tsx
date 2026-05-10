import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { headers } from "next/headers";
import Page from "./[lang]/page";

export const dynamic = "force-dynamic";

/**
 * Root route handler: redirects "/" → "/{defaultLang}"
 * Handles both tenant subdomains (e.g. foo.localhost:3000) and the marketing site.
 */
export default async function RootPage() {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  const lang = site?.default_lang ?? "en";
  return <Page params={Promise.resolve({ lang })} />;
}
