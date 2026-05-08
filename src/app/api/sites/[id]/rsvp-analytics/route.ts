import type {
  RsvpAnalyticsBreakdownItem,
  RsvpAnalyticsData,
  RsvpResponseStatus,
} from "@/3-entities/rsvp/model/types";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

type SitePlanRow = {
  id: string;
  plan_type: string;
};

type PartyRow = {
  preferred_lang: string | null;
  access_code_hash: string | null;
};

type PartyStateRow = {
  status: RsvpResponseStatus | string | null;
  meal_intolerances: string | null;
};

function normalizeLabel(label: string): string {
  return label
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function buildBreakdown(
  counts: Map<string, number>,
): RsvpAnalyticsBreakdownItem[] {
  const total = Array.from(counts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  if (total === 0) return [];

  return Array.from(counts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .map(([key, count]) => ({
      key,
      label: normalizeLabel(key),
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    }));
}

function splitDietary(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

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

    const { data: siteRow, error: siteError } = await supabase
      .from("sites")
      .select("id, plan_type")
      .eq("id", id)
      .maybeSingle();

    if (siteError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-analytics] site lookup error:",
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

    if ((siteRow as SitePlanRow).plan_type !== "premium") {
      return Response.json(
        {
          success: false,
          error: "RSVP analytics are available only on Premium plan.",
        },
        { status: 403 },
      );
    }

    const { data: parties, error: partiesError } = await supabase
      .from("rsvp_parties")
      .select("preferred_lang, access_code_hash")
      .eq("site_id", id);

    if (partiesError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-analytics] parties lookup error:",
        partiesError,
      );
      return Response.json(
        { success: false, error: "Failed to load analytics." },
        { status: 500 },
      );
    }

    const { data: states, error: statesError } = await supabase
      .from("rsvp_party_state")
      .select("status, meal_intolerances")
      .eq("site_id", id);

    if (statesError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-analytics] state lookup error:",
        statesError,
      );
      return Response.json(
        { success: false, error: "Failed to load analytics." },
        { status: 500 },
      );
    }

    const safeParties = (parties ?? []) as PartyRow[];
    const safeStates = (states ?? []) as PartyStateRow[];

    const invitationsSent = safeParties.reduce(
      (sum, party) => (party.access_code_hash ? sum + 1 : sum),
      0,
    );

    const languageCounts = new Map<string, number>();
    for (const party of safeParties) {
      const key =
        (party.preferred_lang || "unknown").trim().toLowerCase() || "unknown";
      languageCounts.set(key, (languageCounts.get(key) ?? 0) + 1);
    }

    const respondedStatuses = new Set<RsvpResponseStatus>([
      "attending",
      "not_attending",
    ]);

    let rsvpsReceived = 0;
    let attendingCount = 0;

    const dietaryCounts = new Map<string, number>();

    for (const state of safeStates) {
      const status = state.status?.trim() as RsvpResponseStatus | undefined;
      const hasResponse = status ? respondedStatuses.has(status) : false;

      if (!hasResponse) continue;

      rsvpsReceived += 1;
      if (status === "attending") {
        attendingCount += 1;
      }

      const dietaryValue = state.meal_intolerances?.trim() ?? "";
      if (!dietaryValue) continue;

      for (const entry of splitDietary(dietaryValue)) {
        dietaryCounts.set(entry, (dietaryCounts.get(entry) ?? 0) + 1);
      }
    }

    const attendanceRate =
      rsvpsReceived === 0
        ? 0
        : Number(((attendingCount / rsvpsReceived) * 100).toFixed(1));

    const analytics: RsvpAnalyticsData = {
      summary: {
        invitations_sent: invitationsSent,
        rsvps_received: rsvpsReceived,
        attending_count: attendingCount,
        attendance_rate: attendanceRate,
      },
      languages: buildBreakdown(languageCounts),
      dietary: buildBreakdown(dietaryCounts),
      generated_at: new Date().toISOString(),
    };

    return Response.json({ success: true, analytics });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}
