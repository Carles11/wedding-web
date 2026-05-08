import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

const BULK_INVITE_CHUNK_SIZE = 20;
const BULK_INVITE_MODES = ["all", "unsent"] as const;

type BulkInviteMode = (typeof BULK_INVITE_MODES)[number];

type GuestRow = {
  id: string;
  email: string | null;
};

type InviteAttemptResult =
  | { kind: "sent"; partyId: string }
  | { kind: "skipped_no_email"; partyId: string }
  | { kind: "failed"; partyId: string; error: string };

type BulkInviteSummary = {
  mode: BulkInviteMode;
  totalCandidates: number;
  sent: number;
  skippedNoEmail: number;
  failed: number;
  errors: Array<{ partyId: string; error: string }>;
};

function parseMode(input: unknown): BulkInviteMode {
  return typeof input === "string" && input === "unsent" ? "unsent" : "all";
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function sendInviteViaEdge(
  supabaseUrl: string,
  serviceKey: string,
  siteId: string,
  partyId: string,
): Promise<InviteAttemptResult> {
  try {
    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/rsvp-invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        site_id: siteId,
        party_id: partyId,
      }),
    });

    if (!edgeRes.ok) {
      const responseText = await edgeRes.text();
      return {
        kind: "failed",
        partyId,
        error: `edge_status_${edgeRes.status}:${responseText || "unknown"}`,
      };
    }

    return { kind: "sent", partyId };
  } catch (error) {
    return {
      kind: "failed",
      partyId,
      error: error instanceof Error ? error.message : "network_error",
    };
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

    const supabase = await createSupabaseSSRClient();

    const { data: siteRow, error: siteError } = await supabase
      .from("sites")
      .select("id, plan_type")
      .eq("id", id)
      .maybeSingle();

    if (siteError) {
      console.error(
        "[POST /api/sites/[id]/bulk-invite] site lookup error:",
        siteError,
      );
      return Response.json(
        { success: false, error: "Failed to verify plan." },
        { status: 500 },
      );
    }

    if (!siteRow) {
      return Response.json(
        { success: false, error: "Site not found." },
        { status: 404 },
      );
    }

    if (siteRow.plan_type !== "premium") {
      return Response.json(
        {
          success: false,
          error: "Bulk invite is available only on Premium plan.",
        },
        { status: 403 },
      );
    }

    let mode: BulkInviteMode = "all";
    try {
      const body = (await req.json()) as { mode?: unknown };
      mode = parseMode(body?.mode);
    } catch {
      mode = "all";
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.MY_CUSTOM_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { success: false, error: "Invite sending is not configured." },
        { status: 500 },
      );
    }

    let guestQuery = supabase
      .from("rsvp_parties")
      .select("id, email")
      .eq("site_id", id)
      .eq("is_active", true);

    if (mode === "unsent") {
      guestQuery = guestQuery.is("access_code_hash", null);
    }

    const { data: guests, error: guestsError } = await guestQuery;

    if (guestsError) {
      console.error(
        "[POST /api/sites/[id]/bulk-invite] guest lookup error:",
        guestsError,
      );
      return Response.json(
        { success: false, error: "Failed to load guests for bulk invite." },
        { status: 500 },
      );
    }

    const candidates = ((guests ?? []) as GuestRow[]).map((g) => ({
      id: g.id,
      email: typeof g.email === "string" ? g.email.trim() : "",
    }));

    const summary: BulkInviteSummary = {
      mode,
      totalCandidates: candidates.length,
      sent: 0,
      skippedNoEmail: 0,
      failed: 0,
      errors: [],
    };

    for (const chunk of chunkArray(candidates, BULK_INVITE_CHUNK_SIZE)) {
      const results = await Promise.all(
        chunk.map(async (guest) => {
          if (!guest.email) {
            return {
              kind: "skipped_no_email",
              partyId: guest.id,
            } as InviteAttemptResult;
          }
          return await sendInviteViaEdge(supabaseUrl, serviceKey, id, guest.id);
        }),
      );

      for (const result of results) {
        if (result.kind === "sent") {
          summary.sent += 1;
        } else if (result.kind === "skipped_no_email") {
          summary.skippedNoEmail += 1;
        } else {
          summary.failed += 1;
          summary.errors.push({ partyId: result.partyId, error: result.error });
        }
      }
    }

    return Response.json({ success: true, summary });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}
