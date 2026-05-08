import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

const SELECT_COLUMNS =
  "id, site_id, name, email, preferred_lang, max_guests, access_code_hash, passcode_hash, is_active, created_at, updated_at";

export async function GET(req: Request, context: RouteContext<{ id: string }>) {
  try {
    const { id } = await getParams(context);

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return Response.json(
        { success: false, error: access.message },
        { status: access.status },
      );
    }

    const url = new URL(req.url);
    const rawQ = url.searchParams.get("q")?.trim() ?? "";
    const q = rawQ.replaceAll(",", " ").slice(0, 100).trim();
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)),
    );
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createSupabaseSSRClient();
    let query = supabase
      .from("rsvp_parties")
      .select(SELECT_COLUMNS, { count: "exact" })
      .eq("site_id", id)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/sites/[id]/rsvp-parties] select error:", error);
      return Response.json(
        { success: false, error: "Failed to load parties." },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      parties: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  context: RouteContext<{ id: string }>,
) {
  try {
    const { id } = await getParams(context);

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return Response.json(
        { success: false, error: access.message },
        { status: access.status },
      );
    }

    const body = await req.json();
    const { name, email, preferred_lang, max_guests } = body as {
      name: unknown;
      email: unknown;
      preferred_lang: unknown;
      max_guests: unknown;
    };

    if (!name || typeof name !== "string" || !name.trim()) {
      return Response.json(
        { success: false, error: "Name is required." },
        { status: 400 },
      );
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return Response.json(
        { success: false, error: "Email is required." },
        { status: 400 },
      );
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json(
        { success: false, error: "Invalid email format." },
        { status: 400 },
      );
    }
    if (!preferred_lang || typeof preferred_lang !== "string") {
      return Response.json(
        { success: false, error: "Preferred language is required." },
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

    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from("rsvp_parties")
      .insert({
        site_id: id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        preferred_lang,
        max_guests,
        is_active: true,
      })
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
      console.error("[POST /api/sites/[id]/rsvp-parties] insert error:", error);
      return Response.json(
        { success: false, error: "Failed to create party." },
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
