/**
 * WhatToSee entry representing recommended places for guests.
 */
export type WhatToSeeEntry = {
  id: string;
  name?: Record<string, string> | string | null;
  description?: Record<string, string> | null;
  website?: string | null;
  notes?: Record<string, string> | null;
};

export type WhatToSeeSection = {
  id: string;
  site_id: string;
  type: "what_to_see";
  title?: Record<string, string> | null;
  subtitle?: Record<string, string> | null;
  content?: {
    entries?: WhatToSeeEntry[] | null;
    [key: string]: unknown;
  } | null;
  created_at?: string | null;
};

// TODO: For better per-entry CRUD and constraints consider migrating to a
// dedicated `what_to_see_entries` table with one row per entry and a site FK.
