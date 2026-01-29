/**
 * Types describing the `sites` table shape used across the app.
 * Keep these minimal and extend as needed.
 */
export type Site = {
  id: string;
  owner?: string | null;
  subdomain?: string | null;
  default_lang?: string | null;
  languages?: string[] | null;
  domains?: string[] | null;
  // Add other fields present in the `sites` table as needed.
};

// Helper type for queries that only select `id`.
export type SiteIdLookupResult = {
  id: string;
};
