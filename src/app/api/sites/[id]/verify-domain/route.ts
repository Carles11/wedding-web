import { verifyCustomDomain } from "@/2-features/builder/custom-domain/api/verifyCustomDomain";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import type { VercelDomainStatusResult } from "@/4-shared/lib/vercel/vercel-domains";
import { getVercelDomainStatus } from "@/4-shared/lib/vercel/vercel-domains";
import { NextRequest, NextResponse } from "next/server";

interface ParseVercelStatusResult {
  status: "pending" | "verified" | "error";
  dnsInstructions?: string;
  error?: string;
}

function parseVercelStatus(
  vercel: VercelDomainStatusResult,
): ParseVercelStatusResult {
  if (!vercel) {
    return { status: "error", error: "No response from Vercel" };
  }

  // Map status as returned by getVercelDomainStatus
  if (vercel.status === "valid") {
    return { status: "verified" };
  }
  if (vercel.status === "pending_validation") {
    return {
      status: "pending",
      dnsInstructions: vercel.dnsInstructions,
    };
  }
  // Error case (with possible instructions)
  return {
    status: "error",
    error: vercel.error || "Unknown error verifying domain.",
    dnsInstructions: vercel.dnsInstructions,
  };
}

export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>,
) {
  try {
    const { id } = await getParams(context);
    const { domain } = (await req.json()) as { domain: string };
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    const vercelResult: VercelDomainStatusResult =
      await getVercelDomainStatus(domain);

    await verifyCustomDomain(id, domain);

    // console.log(JSON.stringify(vercelResult, null, 2));

    const parsed: ParseVercelStatusResult = parseVercelStatus(vercelResult);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
