export const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9\-]{1,61}[a-z0-9])?$/;
export const RESERVED = ["admin", "www", "api"];
export function isValidSubdomain(sub: string): boolean {
  return SUBDOMAIN_REGEX.test(sub) && !RESERVED.includes(sub);
}
