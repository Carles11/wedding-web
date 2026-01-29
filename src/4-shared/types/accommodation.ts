/**
 * Accommodation entry used in the `sections` table under type='accommodation'.
 * Name/address/notes are multilingual maps (lang -> text).
 */
export type AccommodationEntry = {
  id: string;
  name?: Record<string, string> | string | null;
  address?: Record<string, string> | string | null;
  website?: string | null;
  notes?: Record<string, string> | null;
};

export type AccommodationSection = {
  id: string;
  site_id: string;
  type: "accommodation";
  title?: Record<string, string> | null;
  subtitle?: Record<string, string> | null;
  content?: {
    headline?: Record<string, string> | null;
    hotels?: AccommodationEntry[] | null;
    [key: string]: unknown;
  } | null;
  created_at?: string | null;
};

// TODO: Consider a dedicated `accommodations` table for per-entry rows with
// native id, site FK and per-row metadata. This simplifies CRUD and avoids
// full-section read/replace cycles.
