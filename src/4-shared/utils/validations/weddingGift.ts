// Centralized validation for wedding gift inputs

import { EMAIL_RE } from "./regex";

export function isValidIBAN(iban: string): boolean {
  // Simple IBAN regex (not exhaustive, but covers most cases)
  return /^([A-Z]{2}\d{2}[A-Z0-9]{1,30})?$/.test(iban.trim());
}

export function isValidSWIFT(swift: string): boolean {
  // SWIFT/BIC: 8 or 11 characters, letters and digits
  return /^([A-Z0-9]{8}|[A-Z0-9]{11})?$/.test(swift.trim());
}

export function isValidAccountHolder(name: string): boolean {
  // Allow letters, spaces, hyphens, apostrophes, dots
  return name.trim() === "" || /^[\p{L} .'-]+$/u.test(name.trim());
}

export function isValidBankName(name: string): boolean {
  // Allow letters, spaces, hyphens, apostrophes, dots
  return name.trim() === "" || /^[\p{L} .'-]+$/u.test(name.trim());
}

export function isValidPaypal(val: string): boolean {
  if (!val) return true;

  // Check if it's a valid URL (paypal.me/...)
  // OR a valid Email (user@domain.com)
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isUrl = isValidURL(val); // Using the permissive one we built earlier

  return isEmail || isUrl;
}

export function isValidEmail(email: string): boolean {
  // Accept empty or valid email
  if (!email.trim()) return true;
  return EMAIL_RE.test(email.trim());
}

export function isValidURL(url: string): boolean {
  // 1. Accept empty (it's optional in your form)
  if (!url || !url.trim()) return true;

  // 2. Permissive Regex for web addresses
  // Supports: https://google.com, google.com, www.google.com, sub.domain.it
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol (optional)
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i",
  );

  return pattern.test(url.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || !phone.trim()) return true;

  // 1. Allow optional '+' or '00' at the start
  // 2. Allow digits, spaces, dots, dashes, and parentheses
  // 3. Ensure we have between 7 and 15 actual digits
  const phoneRegex = /^((\+|00)?[0-9\s.\-\(\)]{7,20})$/;

  if (!phoneRegex.test(phone.trim())) return false;

  // Secondary check: strip everything but digits and see if length is sane
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function isValidVenmoUsername(username: string): boolean {
  // Accept empty or @username (letters, numbers, underscores, dots)
  return (
    username.trim() === "" || /^@?[A-Za-z0-9_.]{3,30}$/.test(username.trim())
  );
}
