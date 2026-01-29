/**
 * Program/event row representing schedule items for a site.
 * Title/location/description are stored as JSON per-language (jsonb).
 */
export type ProgramEvent = {
  id: string;
  site_id: string;
  day_tag?: "day_before" | "wedding_day" | "day_after" | null;
  date?: string | null; // ISO date string (optional; grouping is by day_tag)
  time?: string | null; // e.g. "18:30"
  title?: Record<string, string> | null; // language -> text
  location?: Record<string, string> | null; // language -> text
  location_url?: string | null;
  description?: Record<string, string> | null;
  sort_order?: number | null;
  created_at?: string | null;
};
