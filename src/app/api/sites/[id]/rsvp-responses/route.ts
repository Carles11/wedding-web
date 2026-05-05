import type {
  RsvpResponseRow,
  RsvpResponseStatus,
} from "@/3-entities/rsvp/model/types";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

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

type RsvpResponsesViewRow = {
  site_id: string;
  party_id: string;

  name: string;
  email: string;
  preferred_lang: string;
  max_guests: number;
  is_active: boolean;
  party_updated_at: string;

  status: string;
  headcount: number | null;
  comment: string | null;
  state_updated_at: string | null;
};

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

    let query = supabase
      .from("rsvp_responses_view")
      .select(
        "site_id, party_id, name, email, preferred_lang, max_guests, is_active, party_updated_at, status, headcount, comment, state_updated_at",
        { count: "exact" },
      )
      .eq("site_id", id)
      .order("party_updated_at", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (status !== STATUS_ALL) {
      query = query.eq("status", status);
    }

    if (q) {
      // PostgREST "or" supports ilike across columns
      const searchExpression = `name.ilike.%${q}%,email.ilike.%${q}%`;
      query = query.or(searchExpression);
    }

    const pageFrom = (page - 1) * limit;
    const pageTo = pageFrom + limit - 1;

    const { data, error, count } = await query.range(pageFrom, pageTo);

    if (error) {
      console.error(
        "[GET /api/sites/[id]/rsvp-responses] select view error:",
        error,
      );
      return Response.json(
        { success: false, error: "Failed to load responses." },
        { status: 500 },
      );
    }

    const rows: RsvpResponseRow[] = (
      (data ?? []) as RsvpResponsesViewRow[]
    ).map((r) => ({
      party: {
        id: r.party_id,
        site_id: r.site_id,
        name: r.name,
        email: r.email,
        preferred_lang: r.preferred_lang,
        max_guests: r.max_guests,
        is_active: r.is_active,
        updated_at: r.party_updated_at,
      },
      state: {
        status: VALID_STATUS_VALUES.includes(r.status as RsvpResponseStatus)
          ? (r.status as RsvpResponseStatus)
          : "unknown",
        headcount: r.headcount,
        comment: r.comment,
        updated_at: r.state_updated_at,
      },
    }));

    return Response.json({
      success: true,
      rows,
      total: Math.max(0, count ?? 0),
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
