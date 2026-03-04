// DB row: raw table shape, no i18n fields
export type WhatToSeeEntry = {
  id: string;
  site_id: string;
  location_url: string | null;
  sort_order: number | null;
  created_at?: string;
  updated_at?: string;
};

// Compose this for all-in-one UI usage: (used only within your component/UI)
export type WhatToSeeEntryFull = WhatToSeeEntry & {
  name?: Record<string, string>;
  description?: Record<string, string>;
  notes?: Record<string, string>;
};

// For creating a new entry (no id, no i18n)
export type CreateWhatToSeePayload = {
  site_id: string;
  location_url?: string | null;
  sort_order?: number | null;
};

export type WhatToSeeTranslation = {
  key: "title" | "description" | "notes";
  locale: string;
  value: string;
};
