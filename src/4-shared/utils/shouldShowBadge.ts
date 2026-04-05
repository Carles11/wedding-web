export async function shouldShowBrandBadge({
  planType,
  routeKind,
}: {
  planType: string;
  routeKind: "tenant" | "marketing" | "builder";
}) {
  // Only show badge for tenant sites
  if (routeKind !== "tenant") return false;
  if (!planType) return false;
  // Show badge if plan is free
  return planType === "free";
}
