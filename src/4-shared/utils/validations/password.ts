// Password validation utilities

export function isValidPassword(password: string): boolean {
  // Minimum 8 characters, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function passwordsMatch(pw1: string, pw2: string): boolean {
  return pw1 === pw2;
}
