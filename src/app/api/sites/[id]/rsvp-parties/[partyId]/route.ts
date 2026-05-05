import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

const SELECT_COLUMNS =
  "id, site_id, name, email, preferred_lang, max_guests, access_code_hash, passcode_hash, is_active, created_at, updated_at";

export async function PUT(
  req: Request,
  context: RouteContext<{ id: string; partyId: string }>,
) {
  try {
    const { id, partyId } = await getParams(context);

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return Response.json(
        { success: false, error: access.message },
        { status: access.status },
      );
    }

    const body = await req.json();
    const { name, email, preferred_lang, max_guests, is_active } = body as {
      name?: unknown;
      email?: unknown;
      preferred_lang?: unknown;
      max_guests?: unknown;
      is_active?: unknown;
    };

    // Validate only present fields
    const patch: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return Response.json(
          { success: false, error: "Name must be a non-empty string." },
          { status: 400 },
        );
      }
      patch.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return Response.json(
          { success: false, error: "Email must be a non-empty string." },
          { status: 400 },
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return Response.json(
          { success: false, error: "Invalid email format." },
          { status: 400 },
        );
      }
      patch.email = email.trim().toLowerCase();
    }

    if (preferred_lang !== undefined) {
      if (typeof preferred_lang !== "string" || !preferred_lang) {
        return Response.json(
          {
            success: false,
            error: "Preferred language must be a non-empty string.",
          },
          { status: 400 },
        );
      }
      if (
        !SUPPORTED_LANGUAGES.includes(
          preferred_lang as (typeof SUPPORTED_LANGUAGES)[number],
        )
      ) {
        return Response.json(
          { success: false, error: "Unsupported preferred language." },
          { status: 400 },
        );
      }
      patch.preferred_lang = preferred_lang;
    }

    if (max_guests !== undefined) {
      if (
        typeof max_guests !== "number" ||
        !Number.isInteger(max_guests) ||
        max_guests < 1
      ) {
        return Response.json(
          { success: false, error: "Max guests must be an integer ≥ 1." },
          { status: 400 },
        );
      }
      patch.max_guests = max_guests;
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        return Response.json(
          { success: false, error: "is_active must be a boolean." },
          { status: 400 },
        );
      }
      patch.is_active = is_active;
    }

    if (Object.keys(patch).length === 0) {
      return Response.json(
        { success: false, error: "No fields to update." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from("rsvp_parties")
      .update(patch)
      .eq("site_id", id)
      .eq("id", partyId)
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      if (error.code === "23505") {
        return Response.json(
          {
            success: false,
            error: "Email already registered.",
            code: "email_duplicate",
          },
          { status: 409 },
        );
      }
      console.error(
        "[PUT /api/sites/[id]/rsvp-parties/[partyId]] update error:",
        error,
      );
      return Response.json(
        { success: false, error: "Failed to update party." },
        { status: 500 },
      );
    }

    return Response.json({ success: true, party: data });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}
