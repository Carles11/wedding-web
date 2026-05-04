import "server-only";

/**
 * Computes the SHA-256 hash of a UTF-8 string and returns it as a lowercase
 * hexadecimal string.
 *
 * Uses the Web Crypto API (crypto.subtle) which is available in Node 18+,
 * Next.js Edge Runtime, and all modern runtimes — no external dependencies.
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
