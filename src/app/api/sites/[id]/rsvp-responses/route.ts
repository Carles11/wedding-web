import type {
  RsvpResponseRow,
  RsvpResponseStatus,
} from "@/3-entities/rsvp/model/types";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

const PARTY_SELECT_COLUMNS =
  "id, site_id, name, email, preferred_lang, max_guests, is_active, updated_at";

const STATUS_ALL = "all";
const VALID_STATUS_VALUES: ReadonlyArray<RsvpResponseStatus> = [
  "unknown",
  "attending",
  "not_attending",
];

function parsePositiveInt(input: string | null, fallback: number): number {
  const parsed = Number.parseInt(input ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseStatus(input: string | null): "all" | RsvpResponseStatus {
  if (input === STATUS_ALL) return STATUS_ALL;
  if (
    input === "unknown" ||
    input === "attending" ||
    input === "not_attending"
  ) {
    return input;
  }
  return STATUS_ALL;
}

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
    const status = parseStatus(url.searchParams.get("status"));
    const includeInactive = url.searchParams.get("include_inactive") === "1";
    const page = parsePositiveInt(url.searchParams.get("page"), 1);
    const limit = Math.min(
      50,
      parsePositiveInt(url.searchParams.get("limit"), 20),
    );

    const supabase = await createSupabaseSSRClient();

    let partyCountQuery = supabase
      .from("rsvp_parties")
      .select("id", { count: "exact", head: true })
      .eq("site_id", id);

    let partyDataQuery = supabase
      .from("rsvp_parties")
      .select(PARTY_SELECT_COLUMNS)
      .eq("site_id", id)
      .order("updated_at", { ascending: false });

    if (!includeInactive) {
      partyCountQuery = partyCountQuery.eq("is_active", true);
      partyDataQuery = partyDataQuery.eq("is_active", true);
    }

    if (q) {
      const searchExpression = `name.ilike.%${q}%,email.ilike.%${q}%`;
      partyCountQuery = partyCountQuery.or(searchExpression);
      partyDataQuery = partyDataQuery.or(searchExpression);
    }

    const { count: baseCount, error: countError } = await partyCountQuery;
    if (countError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-responses] count parties error:",
        countError,
      );
      return Response.json(
        { success: false, error: "Failed to load responses." },
        { status: 500 },
      );
    }

    const pageFrom = (page - 1) * limit;
    const pageTo = pageFrom + limit - 1;

    const { data: parties, error: partiesError } =
      status === STATUS_ALL
        ? await partyDataQuery.range(pageFrom, pageTo)
        : await partyDataQuery;

    if (partiesError) {
      console.error(
        "[GET /api/sites/[id]/rsvp-responses] select parties error:",
        partiesError,
      );
      return Response.json(
        { success: false, error: "Failed to load responses." },
        { status: 500 },
      );
    }

    const partyIds = (parties ?? []).map((party) => party.id);

    let statesByPartyId = new Map<
      string,
      {
        status: RsvpResponseStatus;
        headcount: number | null;
        comment: string | null;
        updated_at: string | null;
      }
    >();

    if (partyIds.length > 0) {
      const stateQuery = supabase
        .from("rsvp_party_state")
        .select("party_id, status, headcount, comment, updated_at")
        .eq("site_id", id)
        .in("party_id", partyIds);

      const { data: states, error: statesError } = await stateQuery;

      if (statesError) {
        console.error(
          "[GET /api/sites/[id]/rsvp-responses] select party_state error:",
          statesError,
        );
        return Response.json(
          { success: false, error: "Failed to load responses." },
          { status: 500 },
        );
      }

      statesByPartyId = new Map(
        (states ?? []).map((state) => [
          state.party_id,
          {
            status: VALID_STATUS_VALUES.includes(state.status)
              ? state.status
              : "unknown",
            headcount: state.headcount,
            comment: state.comment,
            updated_at: state.updated_at ?? null,
          },
        ]),
      );
    }

    const mergedRows: RsvpResponseRow[] = (parties ?? []).map((party) => ({
      party,
      state: statesByPartyId.get(party.id) ?? {
        status: "unknown",
        headcount: null,
        comment: null,
        updated_at: null,
      },
    }));

    const filteredRows =
      status === STATUS_ALL
        ? mergedRows
        : mergedRows.filter((row) => row.state.status === status);

    const rows =
      status === STATUS_ALL
        ? filteredRows
        : filteredRows.slice(pageFrom, pageTo + 1);
    const total =
      status === STATUS_ALL ? Math.max(0, baseCount ?? 0) : filteredRows.length;

    return Response.json({
      success: true,
      rows,
      total,
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
