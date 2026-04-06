/**
 * Contact section content stored in `sections` table under type='contact'.
 */
export type ContactSection = {
  id: string;
  site_id: string;
  type: "contact";
  title?: Record<string, string> | null;
  // Store static contact info for two partners. Names allow non-ASCII characters.
  content?: {
    bride?: {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
    } | null;
    groom?: {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
    } | null;
    // Optional image id referencing `images.id` for a shared contact image.
    image_id?: string | null;
    [key: string]: unknown;
  } | null;
  created_at?: string | null;
};

// TODO: Consider storing contacts in a dedicated `contacts` table for auditing,
// server-side validation and easier per-field constraints (email uniqueness,
// format checks, etc.).
