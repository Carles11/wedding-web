/**
 * Types describing the `sites` table shape used across the app.
 * Keep these minimal and extend as needed.
 */
export type Site = {
  id: string;
  // The actual owner column in the DB is `owner_user_id` (uuid)
  owner_user_id?: string | null;
  // Site title (database has `title text not null`)
  title: string;
  subdomain?: string | null;
  default_lang?: string | null;
  languages?: string[] | null;
  domains?: string[] | null;
  created_at?: string | null;
  // Add other fields present in the `sites` table as needed.
};

// Helper type for queries that only select `id`.
export type SiteIdLookupResult = {
  id: string;
};
