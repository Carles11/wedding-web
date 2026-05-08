import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

export async function GET(
  _req: Request,
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

    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from("rsvp_settings")
      .select("site_id, is_enabled, deadline_at")
      .eq("site_id", id)
      .maybeSingle();

    if (error) {
      console.error("[GET /api/sites/[id]/rsvp-settings] select error:", error);
      return Response.json(
        { success: false, error: "Failed to load RSVP settings." },
        { status: 500 },
      );
    }

    return Response.json({ success: true, settings: data ?? null });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, context: RouteContext<{ id: string }>) {
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
    const { is_enabled, deadline_at } = body as {
      is_enabled: unknown;
      deadline_at: unknown;
    };

    if (typeof is_enabled !== "boolean") {
      return Response.json(
        { success: false, error: "is_enabled must be a boolean" },
        { status: 400 },
      );
    }
    if (deadline_at !== null && typeof deadline_at !== "string") {
      return Response.json(
        { success: false, error: "deadline_at must be a string or null" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase
      .from("rsvp_settings")
      .upsert(
        { site_id: id, is_enabled, deadline_at: deadline_at ?? null },
        { onConflict: "site_id" },
      );

    if (error) {
      console.error("[PUT /api/sites/[id]/rsvp-settings] upsert error:", error);
      return Response.json(
        { success: false, error: "Failed to save RSVP settings." },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}
