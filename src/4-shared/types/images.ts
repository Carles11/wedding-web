/**
 * Image row stored in Supabase `images` table.
 * Fields are minimal; extend as your schema requires.
 */
export type ImageRow = {
  id: string;
  site_id: string;
  bucket?: string | null;
  path?: string | null; // storage path inside bucket
  url?: string | null; // optional public url
  section?: string | null; // e.g. 'hero', 'contact', etc.
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
};
