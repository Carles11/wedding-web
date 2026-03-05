import { NextRequest, NextResponse } from "next/server";
import { addCustomDomain } from "@/2-features/custom-domain/api/addCustomDomain";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;
    const { domain } = await req.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid site id" }, { status: 400 });
    }

    const result = await addCustomDomain(id, domain);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[add-domain] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
