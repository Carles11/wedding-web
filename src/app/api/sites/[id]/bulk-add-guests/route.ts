import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

const SELECT_COLUMNS =
  "id, site_id, name, email, preferred_lang, max_guests, access_code_hash, passcode_hash, is_active, created_at, updated_at";
const MAX_IMPORT_ROWS = 200;

type InputRow = {
  name?: unknown;
  email?: unknown;
  preferred_lang?: unknown;
  max_guests?: unknown;
};

type NormalizedRow = {
  rowNumber: number;
  name: string;
  email: string;
  preferred_lang: (typeof SUPPORTED_LANGUAGES)[number];
  max_guests: number;
};

type ExistingGuest = {
  id: string;
  email: string;
};

function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function parseMaxGuests(input: unknown): number | null {
  if (input === undefined || input === null || input === "") return 1;
  if (typeof input === "number") {
    return Number.isInteger(input) && input >= 1 ? input : null;
  }
  if (typeof input === "string") {
    const parsed = Number.parseInt(input.trim(), 10);
    return Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
  }
  return null;
}

function normalizeRow(
  row: InputRow,
  rowNumber: number,
): { row?: NormalizedRow; error?: string } {
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const email =
    typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
  const preferred_lang =
    typeof row.preferred_lang === "string"
      ? row.preferred_lang.trim().toLowerCase()
      : "en";
  const max_guests = parseMaxGuests(row.max_guests);

  if (!name) {
    return { error: "Name is required." };
  }
  if (!email) {
    return { error: "Email is required." };
  }
  if (!isEmail(email)) {
    return { error: "Invalid email format." };
  }
  if (
    !SUPPORTED_LANGUAGES.includes(
      preferred_lang as (typeof SUPPORTED_LANGUAGES)[number],
    )
  ) {
    return { error: "Unsupported preferred language." };
  }
  if (max_guests === null) {
    return {
      error: "Max guests must be an integer greater than or equal to 1.",
    };
  }

  return {
    row: {
      rowNumber,
      name,
      email,
      preferred_lang: preferred_lang as (typeof SUPPORTED_LANGUAGES)[number],
      max_guests,
    },
  };
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

    const body = (await req.json()) as { rows?: unknown };
    if (!Array.isArray(body.rows)) {
      return Response.json(
        { success: false, error: "rows must be an array." },
        { status: 400 },
      );
    }

    if (body.rows.length === 0) {
      return Response.json(
        { success: false, error: "At least one guest row is required." },
        { status: 400 },
      );
    }

    if (body.rows.length > MAX_IMPORT_ROWS) {
      return Response.json(
        {
          success: false,
          error: `You can import up to ${MAX_IMPORT_ROWS} guests at a time.`,
        },
        { status: 400 },
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
        "[POST /api/sites/[id]/bulk-add-guests] site lookup error:",
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
          error: "Bulk guest import is available only on Premium plan.",
        },
        { status: 403 },
      );
    }

    const normalizedRows: NormalizedRow[] = [];
    for (const [index, rawRow] of body.rows.entries()) {
      const result = normalizeRow((rawRow ?? {}) as InputRow, index + 1);
      if (!result.row) {
        return Response.json(
          { success: false, error: result.error ?? "Invalid guest row." },
          { status: 400 },
        );
      }
      normalizedRows.push(result.row);
    }

    const duplicateEmailSet = new Set<string>();
    const seenEmails = new Set<string>();
    for (const row of normalizedRows) {
      if (seenEmails.has(row.email)) {
        duplicateEmailSet.add(row.email);
        continue;
      }
      seenEmails.add(row.email);
    }

    if (duplicateEmailSet.size > 0) {
      return Response.json(
        {
          success: false,
          error:
            "Duplicate emails found in this import. Remove duplicates and try again.",
          results: normalizedRows
            .filter((row) => duplicateEmailSet.has(row.email))
            .map((row) => ({
              rowNumber: row.rowNumber,
              name: row.name,
              email: row.email,
              action: "failed" as const,
              error: "Duplicate email in the same import.",
            })),
        },
        { status: 400 },
      );
    }

    const { data: existingGuests, error: existingGuestsError } = await supabase
      .from("rsvp_parties")
      .select("id, email")
      .eq("site_id", id)
      .in(
        "email",
        normalizedRows.map((row) => row.email),
      );

    if (existingGuestsError) {
      console.error(
        "[POST /api/sites/[id]/bulk-add-guests] existing guest lookup error:",
        existingGuestsError,
      );
      return Response.json(
        { success: false, error: "Failed to load existing guests." },
        { status: 500 },
      );
    }

    const existingByEmail = new Map(
      ((existingGuests ?? []) as ExistingGuest[]).map((guest) => [
        guest.email,
        guest,
      ]),
    );

    const summary = {
      totalRows: normalizedRows.length,
      created: 0,
      updated: 0,
      failed: 0,
      results: [] as Array<{
        rowNumber: number;
        name: string;
        email: string;
        action: "created" | "updated" | "failed";
        error?: string;
      }>,
    };

    // TODO: Extend bulk imports with guest grouping and import audit metadata when segmentation lands.
    for (const row of normalizedRows) {
      const payload = {
        name: row.name,
        email: row.email,
        preferred_lang: row.preferred_lang,
        max_guests: row.max_guests,
        is_active: true,
      };
      const existingGuest = existingByEmail.get(row.email);

      if (existingGuest) {
        const { error } = await supabase
          .from("rsvp_parties")
          .update(payload)
          .eq("site_id", id)
          .eq("id", existingGuest.id)
          .select(SELECT_COLUMNS)
          .single();

        if (error) {
          summary.failed += 1;
          summary.results.push({
            rowNumber: row.rowNumber,
            name: row.name,
            email: row.email,
            action: "failed",
            error:
              error.code === "23505"
                ? "Email already registered."
                : "Failed to update guest.",
          });
          continue;
        }

        summary.updated += 1;
        summary.results.push({
          rowNumber: row.rowNumber,
          name: row.name,
          email: row.email,
          action: "updated",
        });
        continue;
      }

      const { error } = await supabase
        .from("rsvp_parties")
        .insert({
          site_id: id,
          ...payload,
        })
        .select(SELECT_COLUMNS)
        .single();

      if (error) {
        summary.failed += 1;
        summary.results.push({
          rowNumber: row.rowNumber,
          name: row.name,
          email: row.email,
          action: "failed",
          error:
            error.code === "23505"
              ? "Email already registered."
              : "Failed to create guest.",
        });
        continue;
      }

      summary.created += 1;
      summary.results.push({
        rowNumber: row.rowNumber,
        name: row.name,
        email: row.email,
        action: "created",
      });
    }

    return Response.json({ success: true, summary });
  } catch {
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}
