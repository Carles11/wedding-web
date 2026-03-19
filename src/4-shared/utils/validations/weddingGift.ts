// Centralized validation for wedding gift inputs

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

export function isValidURL(url: string): boolean {
  // Accept empty or valid URL
  if (!url.trim()) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  // Accept empty or +countrycode and digits, min 7 digits
  return phone.trim() === "" || /^\+?\d{7,15}$/.test(phone.trim());
}

export function isValidVenmoUsername(username: string): boolean {
  // Accept empty or @username (letters, numbers, underscores, dots)
  return (
    username.trim() === "" || /^@?[A-Za-z0-9_.]{3,30}$/.test(username.trim())
  );
}
