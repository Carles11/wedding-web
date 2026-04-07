const PLATFORM_SUFFIXES = [".weddweb.com", ".localhost:3000"];

/**
 * Returns the best canonical domain for SEO signals.
 *
 * Priority: first verified custom domain from `site.domains` that is NOT
 * a platform subdomain (*.weddweb.com / *.localhost:3000).
 * Falls back to `fallbackHost` (the raw request host header).
 */
export function getPrimaryDomain(
  site: {
    domains?: string[] | null;
    domain_statuses?: Record<string, string> | null;
  } | null,
  fallbackHost: string,
): string {
  if (!site?.domains?.length) return fallbackHost;

  const isPlatform = (d: string) =>
    PLATFORM_SUFFIXES.some((s) => d.endsWith(s));

  const verified = site.domains.find(
    (d) =>
      !isPlatform(d) &&
      !d.startsWith("www.") &&
      site.domain_statuses?.[d] === "verified",
  );

  return verified ?? fallbackHost;
}
