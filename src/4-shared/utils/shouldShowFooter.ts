export async function shouldShowFooter({
  planType,
  routeKind,
}: {
  planType: string;
  routeKind: "tenant" | "marketing" | "builder";
}) {
  // Always show on marketing and builder
  if (routeKind === "marketing" || routeKind === "builder") return true;

  // For tenant sites:

  if (!planType) return false;
  // LOGIC: If it's a tenant site, we show the footer IF the plan is free.
  // We don't need to check the host string as strictly if getSiteByDomain already worked.
  if (routeKind === "tenant") {
    // Rely on the site's cached plan_type if possible,
    // otherwise use your subscription fetch.
    return planType === "free";
  }

  return false;
}
