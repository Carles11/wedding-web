import {
  removeCustomDomain,
  RemoveDomainError,
} from "@/2-features/builder/custom-domain/api/removeCustomDomain";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { getParams, RouteContext } from "@/4-shared/lib/route-context";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>,
) {
  try {
    const { id } = await getParams(context);

    // Multitenancy/SaaS Guard: Ensure current user owns this site
    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status },
      );
    }

    const body = await req.json();
    const { domain } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    // Process removal (Supabase + Sequenced Vercel Removal)
    const result = await removeCustomDomain(id, domain);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[REMOVE_DOMAIN_API_ERROR]", error);

    if (error instanceof RemoveDomainError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
