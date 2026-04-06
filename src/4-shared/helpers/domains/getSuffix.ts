// Helper to get the correct domain suffix for the current environment
export function getDomainSuffix() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost") {
      return "localhost:3000";
    } else if (hostname.includes("vercel.app")) {
      // Use the current host as the suffix, minus the subdomain
      const hostParts = hostname.split(".");
      hostParts[0] = ""; // Remove subdomain placeholder
      return hostParts.filter(Boolean).join(".");
    }
  }
  return "weddweb.com";
}
