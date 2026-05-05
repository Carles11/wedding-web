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
  name: string;
  email: string;
  preferred_lang: string;
  max_guests: number;
  access_code_hash: string | null;
  passcode_hash: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Subset of the rsvp_party_state row returned by Supabase. */
export type RsvpPartyState = {
  party_id: string;
  site_id: string;
  status: string;
  headcount: number | null;
  comment: string | null;
  meal_intolerances: string | null;
  song_request: string | null;
  updated_at: string;
};

/** Subset of the rsvp_submissions row returned by Supabase. */
export type RsvpSubmission = {
  id: string;
  site_id: string;
  party_id: string;
  lang: string;
  payload: Record<string, unknown>;
  submitted_at: string;
};

export type RsvpResponseStatus = "unknown" | "attending" | "not_attending";

export type RsvpResponseRow = {
  party: Pick<
    RsvpParty,
    | "id"
    | "site_id"
    | "name"
    | "email"
    | "preferred_lang"
    | "max_guests"
    | "is_active"
    | "updated_at"
  >;
  state: {
    status: RsvpResponseStatus;
    headcount: number | null;
    comment: string | null;
    meal_intolerances: string | null;
    song_request: string | null;
    updated_at: string | null;
  };
};

export type RsvpAnalyticsBreakdownItem = {
  key: string;
  label: string;
  count: number;
  percentage: number;
};

export type RsvpAnalyticsSummary = {
  invitations_sent: number;
  rsvps_received: number;
  attending_count: number;
  attendance_rate: number;
};

export type RsvpAnalyticsData = {
  summary: RsvpAnalyticsSummary;
  languages: RsvpAnalyticsBreakdownItem[];
  dietary: RsvpAnalyticsBreakdownItem[];
  generated_at: string;
};

export type RsvpAnalyticsJson =
  | {
      success: true;
      analytics: RsvpAnalyticsData;
    }
  | {
      success: false;
      error: string;
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
