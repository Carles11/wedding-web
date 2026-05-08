import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

function parsePositiveInt(input: string | null, fallback: number): number {
  const parsed = Number.parseInt(input ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(
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

    const url = new URL(req.url);
    const page = parsePositiveInt(url.searchParams.get("page"), 1);
    const limit = Math.min(
      50,
      parsePositiveInt(url.searchParams.get("limit"), 10),
    );
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createSupabaseSSRClient();

    const { data: party, error: partyError } = await supabase
      .from("rsvp_parties")
      .select("id")
      .eq("site_id", id)
      .eq("id", partyId)
      .maybeSingle();

    if (partyError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-parties/[partyId]/rsvp-submissions] verify party error:",
        partyError,
      );
      return Response.json(
        { success: false, error: "Failed to load submissions." },
        { status: 500 },
      );
    }

    if (!party) {
      return Response.json(
        { success: false, error: "Party not found." },
        { status: 404 },
      );
    }

    const {
      data: submissions,
      error: submissionsError,
      count,
    } = await supabase
      .from("rsvp_submissions")
      .select("id, site_id, party_id, lang, payload, submitted_at", {
        count: "exact",
      })
      .eq("site_id", id)
      .eq("party_id", partyId)
      .order("submitted_at", { ascending: false })
      .range(from, to);

    if (submissionsError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-parties/[partyId]/rsvp-submissions] select submissions error:",
        submissionsError,
      );
      return Response.json(
        { success: false, error: "Failed to load submissions." },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      submissions: submissions ?? [],
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
