// Centralized domain validation for custom domains

// Basic domain regex: supports internationalized domains, prevents invalid chars, double dots, etc.
export const DOMAIN_REGEX =
  /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z]{2,}|xn--[A-Za-z0-9]+)$/;

// More robust regex for full domain (apex + subdomains)
export const FULL_DOMAIN_REGEX =
  /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/;

export function isValidDomain(domain: string): boolean {
  // Accept only valid domain format, no protocol, no path/query
  const cleaned = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/^www\./, "");
  // Must not be empty, must match regex, must not be reserved
  if (!cleaned) return false;
  // Prevent reserved words as apex domain
  const reserved = ["admin", "www", "api"];
  if (reserved.includes(cleaned)) return false;
  // Check for valid domain
  return FULL_DOMAIN_REGEX.test(cleaned);
}
