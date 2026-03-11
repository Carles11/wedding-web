import { removeCustomDomain } from "@/2-features/builder/custom-domain/api/removeCustomDomain";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>,
) {
  try {
    const { id } = await getParams(context);

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status },
      );
    }

    const { domain } = await req.json();

    if (!domain || typeof domain !== "string")
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });

    const result = await removeCustomDomain(id, domain);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
