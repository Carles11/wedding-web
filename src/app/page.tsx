export const dynamic = "force-dynamic";

/**
 * Root SSR page for weddweb.com platform.
 * Detects marketing vs. tenant domains and SSR redirects accordingly.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";
import { MarketingLanding } from "@/4-shared/ui/marketingLanding/MarketingLanding";

// Only show marketing landing on the SaaS home domains:
const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

export default async function Page() {
  // Host header, always lowercase, trimmed for robust matching.
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  // if (host === "localhost" || host.startsWith("localhost:")) {
  //   // Don't match any tenant site, show the main marketing page instead
  //   return <MarketingLanding />;
  // }
  // Marketing domains = always show platform landing.
  if (MARKETING_DOMAINS.includes(host)) {
    return <MarketingLanding />;
  }

  // Try SSR tenant lookup by host for user event/custom domains.
  const siteId = await getSiteIdForDomain(host);

  if (siteId) {
    // SSR: redirect "/" → /[default_lang] (e.g. /ca) for event domain
    const defaultLang = await getSiteDefaultLang(siteId);
    redirect(`/${defaultLang}`);
  }

  // Fallback: Unknown, not in Supabase "domains" array.

  return <MarketingLanding />;
}
