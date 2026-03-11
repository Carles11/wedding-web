import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { getSiteByDomain } from "../lib/getSiteByDomain";

/**
 * SSR utility for determining if the global footer should display.
 * - Shows footer for free plans and for www subdomain marketing/builder by design.
 */
export async function shouldShowFooter({
  host,
  routeKind,
}: {
  host: string;
  routeKind: "tenant" | "marketing" | "builder";
}) {
  // Always show on marketing and builder.
  if (routeKind === "marketing" || routeKind === "builder") return true;

  // SSR: Look up site by host.
  const site = await getSiteByDomain(host);
  // Only for tenant subdomain (free): show footer
  if (
    routeKind === "tenant" &&
    !!site?.subdomain &&
    (host.endsWith(".weddweb.com") || host.endsWith("localhost:3000"))
  ) {
    // If missing user, safer to err on "show".
    if (!site.owner_user_id) return true;

    const subscription = await getCurrentUserSubscription(site.owner_user_id);

    // Show footer only for free plan types.
    return subscription?.plan_type === "free";
  }

  // Hide in all premium/agency/own-domain scenarios.
  return false;
}
