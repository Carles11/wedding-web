import { NextRequest, NextResponse } from "next/server";
import { removeCustomDomain } from "@/2-features/custom-domain/api/removeCustomDomain";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params;
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
