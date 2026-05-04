import "server-only";

import { sha256Hex } from "@/4-shared/lib/crypto/sha256Hex";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type {
  RsvpParty,
  RsvpPartyState,
  RsvpSettings,
  ValidateRsvpAccessCodeResult,
} from "../model/types";

export type ValidateRsvpAccessCodeInput = {
  siteId: string;
  rawCode: string;
  /** Overridable for testing without mocking Date. Defaults to new Date(). */
  now?: Date;
};

export async function validateRsvpAccessCode(
  input: ValidateRsvpAccessCodeInput,
): Promise<ValidateRsvpAccessCodeResult> {
  const { siteId, rawCode, now = new Date() } = input;

  // --- Guard: blank inputs ---
  if (!siteId?.trim() || !rawCode?.trim()) {
    return { ok: false, reason: "invalid_input" };
  }

  const codeHash = await sha256Hex(rawCode);

  // --- Lookup 1: rsvp_settings ---
  const { data: settingsRow, error: settingsError } = await supabaseAdmin
    .from("rsvp_settings")
    .select("site_id, is_enabled, deadline_at")
    .eq("site_id", siteId)
    .maybeSingle();

  if (settingsError) {
    console.error(
      "[validateRsvpAccessCode] settings lookup error:",
      settingsError,
    );
    return { ok: false, reason: "internal_error" };
  }

  if (!settingsRow) {
    return { ok: false, reason: "rsvp_not_configured" };
  }

  const settings = settingsRow as RsvpSettings;

  if (!settings.is_enabled) {
    return { ok: false, reason: "rsvp_disabled" };
  }

  if (settings.deadline_at && now > new Date(settings.deadline_at)) {
    return { ok: false, reason: "rsvp_deadline_passed" };
  }

  // --- Lookup 2: rsvp_parties ---
  const { data: partyRow, error: partyError } = await supabaseAdmin
    .from("rsvp_parties")
    .select(
      "id, site_id, access_code_hash, is_active, max_guests, preferred_lang",
    )
    .eq("site_id", siteId)
    .eq("access_code_hash", codeHash)
    .eq("is_active", true)
    .maybeSingle();

  if (partyError) {
    console.error("[validateRsvpAccessCode] party lookup error:", partyError);
    return { ok: false, reason: "internal_error" };
  }

  if (!partyRow) {
    return { ok: false, reason: "invalid_code" };
  }

  const party = partyRow as RsvpParty;

  // --- Lookup 3: rsvp_party_state (nullable — first-time visitor has no state) ---
  const { data: stateRow, error: stateError } = await supabaseAdmin
    .from("rsvp_party_state")
    .select("party_id, site_id, status, headcount, comment, updated_at")
    .eq("party_id", party.id)
    .eq("site_id", siteId)
    .maybeSingle();

  if (stateError) {
    console.error(
      "[validateRsvpAccessCode] party state lookup error:",
      stateError,
    );
    return { ok: false, reason: "internal_error" };
  }

  const partyState = (stateRow as RsvpPartyState | null) ?? null;

  return { ok: true, codeHash, party, settings, partyState };
}
