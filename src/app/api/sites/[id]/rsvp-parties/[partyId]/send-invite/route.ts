import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

export async function POST(
  _req: Request,
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

    const supabase = await createSupabaseSSRClient();
    const { data: party, error: partyError } = await supabase
      .from("rsvp_parties")
      .select("id, site_id, is_active")
      .eq("site_id", id)
      .eq("id", partyId)
      .maybeSingle();

    if (partyError) {
      console.error(
        "[POST /api/sites/[id]/rsvp-parties/[partyId]/send-invite] party lookup error:",
        partyError,
      );
      return Response.json(
        { success: false, error: "Failed to send invite." },
        { status: 500 },
      );
    }

    if (!party) {
      return Response.json(
        { success: false, error: "Party not found." },
        { status: 404 },
      );
    }

    if (!party.is_active) {
      return Response.json(
        { success: false, error: "Party must be active to send an invite." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.MY_CUSTOM_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { success: false, error: "Invite sending is not configured." },
        { status: 500 },
      );
    }

    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/rsvp-invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        site_id: id,
        party_id: partyId,
      }),
    });

    if (!edgeRes.ok) {
      const edgeBody = await edgeRes.text();
      console.error(
        "[POST /api/sites/[id]/rsvp-parties/[partyId]/send-invite] edge invoke failed",
        { status: edgeRes.status, body: edgeBody },
      );
      return Response.json(
        { success: false, error: "Failed to send invite." },
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
