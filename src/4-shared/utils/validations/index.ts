export * from "./password";
export { EMAIL_RE } from "./regex";
export * from "./subdomain";
export * from "./weddingGift";
export { isValidURL } from "./weddingGift";
import { EMAIL_RE } from "./regex";
export function isValidEmail(email: string): boolean {
  // Accept empty or valid email
  if (!email.trim()) return true;
  return EMAIL_RE.test(email.trim());
}
