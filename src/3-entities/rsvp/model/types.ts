/** Subset of the rsvp_settings row returned by Supabase. */
export type RsvpSettings = {
  site_id: string;
  is_enabled: boolean;
  deadline_at: string | null;
};

/** Subset of the rsvp_parties row returned by Supabase. */
export type RsvpParty = {
  id: string;
  site_id: string;
  access_code_hash: string;
  is_active: boolean;
  max_guests: number;
  preferred_lang: string | null;
};

/** Subset of the rsvp_party_state row returned by Supabase. */
export type RsvpPartyState = {
  party_id: string;
  site_id: string;
  status: string;
  headcount: number | null;
  comment: string | null;
  updated_at: string;
};

/** Discriminated union returned by validateRsvpAccessCode. */
export type ValidateRsvpAccessCodeResult =
  | {
      ok: true;
      codeHash: string;
      party: RsvpParty;
      settings: RsvpSettings;
      partyState: RsvpPartyState | null;
    }
  | {
      ok: false;
      reason:
        | "invalid_input"
        | "rsvp_not_configured"
        | "rsvp_disabled"
        | "rsvp_deadline_passed"
        | "invalid_code"
        | "internal_error";
    };
