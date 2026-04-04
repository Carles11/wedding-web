/**
 * Safe, non-breaking translation helper.
 * If 'vars' is provided, it interpolates. If not, it behaves exactly like your old version.
 */
export function t(
  translations: Record<string, string> | undefined,
  key: string,
  fallback: string,
  vars?: Record<string, string | number>, // Optional: Doesn't break existing calls
): string {
  const text = translations?.[key] || fallback;

  // If no variables are passed, or text is empty, return exactly like before
  if (!vars || !text) return text;

  // Otherwise, perform interpolation
  return text.replace(/\{(\w+)\}/g, (match, k) => {
    return vars[k] !== undefined ? String(vars[k]) : match;
  });
}
