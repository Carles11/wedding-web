export function interpolate(
  text: string,
  vars: Record<string, string | number>,
): string {
  if (!text) return "";
  return text.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}
