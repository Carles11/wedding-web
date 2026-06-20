// src/4-shared/lib/seo/getMetadataBase.ts

/**
 * Centralized logic to determine the base URL for Metadata.
 * Resolves the Next.js 'metadataBase' warning and keeps SEO consistent.
 */
export function getMetadataBase(
  host: string | null,
  isTenant: boolean = false,
) {
  // 1. Fallback & Normalization
  let currentHost = host || (isTenant ? "tenant.weddweb.com" : "weddweb.com");

  // 🚀 SEO Fix: Force non-www for the marketing site to prevent duplicate indexing
  // Only do this if you prefer weddweb.com over www.weddweb.com
  if (!isTenant && currentHost.startsWith("www.")) {
    currentHost = currentHost.slice(4);
  }

  // 2. Protocol
  const protocol = currentHost.includes("localhost") ? "http" : "https";

  // 3. Absolute Base URL
  const baseUrl = `${protocol}://${currentHost}`;

  return {
    metadataBase: new URL(baseUrl),
    baseUrl,
  };
}
