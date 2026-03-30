// src/4-shared/lib/seo/getMetadataBase.ts

/**
 * Centralized logic to determine the base URL for Metadata.
 * Resolves the Next.js 'metadataBase' warning and keeps SEO consistent.
 */
export function getMetadataBase(
  host: string | null,
  isTenant: boolean = false,
) {
  // 1. Fallback for local development or missing headers
  const defaultHost = isTenant
    ? "your-default-tenant-subdomain.weddweb.com"
    : "weddweb.com";
  const currentHost = host || defaultHost;

  // 2. Protocol - almost always https in production
  const protocol = currentHost.includes("localhost") ? "http" : "https";

  // 3. The absolute Base URL
  const baseUrl = `${protocol}://${currentHost}`;

  return {
    // The URL object Next.js expects for metadataBase
    metadataBase: new URL(baseUrl),
    // The raw string for use in other logic
    baseUrl,
  };
}
