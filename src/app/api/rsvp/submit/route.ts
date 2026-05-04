import { validateRsvpAccessCode } from "@/3-entities/rsvp/lib/validateRsvpAccessCode";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { resolveSiteIdFromHost } from "@/4-shared/lib/site/resolveSiteIdFromHost";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES = ["attending", "not_attending"] as const;
type RsvpStatus = (typeof ALLOWED_STATUSES)[number];

function isAllowedStatus(value: string): value is RsvpStatus {
  return (ALLOWED_STATUSES as readonly string[]).includes(value);
}

export async function POST(req: Request) {
  const host = req.headers.get("host") ?? "";
  const resolved = await resolveSiteIdFromHost(host);

  if (!resolved) {
    return new Response("Site not found.", { status: 400 });
  }

  const { siteId } = resolved;

  // --- Parse form data ---
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const code = formData.get("code");
  const lang = formData.get("lang");
  const statusRaw = formData.get("status");
  const headcountRaw = formData.get("headcount");
  const commentRaw = formData.get("comment");

  const langCandidate = typeof lang === "string" ? lang.trim() : "";
  const langStr = (SUPPORTED_LANGUAGES as readonly string[]).includes(
    langCandidate,
  )
    ? langCandidate
    : "en";

  function errorRedirect() {
    return NextResponse.redirect(
      new URL(`/${langStr}/rsvp/error`, req.url),
      303,
    );
  }

  // --- Required field guards (never log code) ---
  if (typeof code !== "string" || !code.trim()) return errorRedirect();
  if (typeof statusRaw !== "string" || !isAllowedStatus(statusRaw))
    return errorRedirect();

  const rawCode = code.trim();
  const status: RsvpStatus = statusRaw;

  // --- Comment validation ---
  const commentStr = typeof commentRaw === "string" ? commentRaw.trim() : "";
  if (commentStr.length > 1000) return errorRedirect();
  const commentNorm = commentStr.length > 0 ? commentStr : null;

  // --- Validate access code ---
  const result = await validateRsvpAccessCode({ siteId, rawCode });
  if (!result.ok) return errorRedirect();

  const { party } = result;

  // --- Normalize headcount ---
  let headcountNorm: number;

  if (status === "not_attending") {
    headcountNorm = 0;
  } else {
    const parsed = parseInt(
      typeof headcountRaw === "string" ? headcountRaw : "",
      10,
    );
    if (isNaN(parsed) || parsed < 1 || parsed > party.max_guests) {
      return errorRedirect();
    }
    headcountNorm = parsed;
  }

  const now = new Date().toISOString();

  // --- Insert rsvp_submissions ---
  const { error: submissionError } = await supabaseAdmin
    .from("rsvp_submissions")
    .insert({
      site_id: siteId,
      party_id: party.id,
      lang: langStr,
      payload: {
        status,
        headcount: headcountNorm,
        comment: commentNorm,
        userAgent: req.headers.get("user-agent") ?? null,
        submittedAt: now,
      },
    });

  if (submissionError) {
    console.error("[rsvpSubmit] submission insert error:", submissionError);
    return errorRedirect();
  }

  // --- Upsert rsvp_party_state ---
  const { error: stateError } = await supabaseAdmin
    .from("rsvp_party_state")
    .upsert(
      {
        party_id: party.id,
        site_id: siteId,
        status,
        headcount: headcountNorm,
        comment: commentNorm,
        updated_at: now,
      },
      { onConflict: "party_id" },
    );

  if (stateError) {
    console.error("[rsvpSubmit] party state upsert error:", stateError);
    return errorRedirect();
  }

  return NextResponse.redirect(
    new URL(`/${langStr}/rsvp/success`, req.url),
    303,
  );
}
