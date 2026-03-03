/**
 * Accommodation entry used in the `sections` table under type='accommodation'.
 * Name/address/notes are multilingual maps (lang -> text).
 */
export type AccommodationEntry = {
  id: string;
  site_id: string;
  name: string;
  address?: string;
  notes?: string;
  website?: string;
  phone?: string;
  email?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
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

// New plain-text fields—no i18n/translation per entry!
export type AccommodationFormValues = {
  name: string;
  address?: string;
  notes?: string;
  website?: string;
  phone?: string;
  email?: string;
  sort_order?: number;
};

// TODO: Consider a dedicated `accommodations` table for per-entry rows with
// native id, site FK and per-row metadata. This simplifies CRUD and avoids
// full-section read/replace cycles.
