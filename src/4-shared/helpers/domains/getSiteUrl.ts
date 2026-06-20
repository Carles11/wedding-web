/**
 * Generates the correct URL for a tenant site based on the current environment.
 */
export function getSiteUrl(subdomain: string): string {
  if (typeof window === "undefined") return "";

  const { hostname, protocol } = window.location;

  // 1. Local Development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost:3000/en?preview=${subdomain}`;
  }

  // 2. Vercel Preview/Branch Deploys
  if (hostname.includes("vercel.app")) {
    const hostParts = hostname.split(".");
    // Replace the first part (the hash) with the subdomain
    hostParts[0] = subdomain;
    return `${protocol}//${hostParts.join(".")}`;
  }

  // 3. Production
  return `https://${subdomain}.weddweb.com`;
}
