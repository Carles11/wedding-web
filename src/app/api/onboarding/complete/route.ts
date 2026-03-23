import { completeOnboarding } from "@/2-features/auth/api/completeOnboarding";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const result = await completeOnboarding();
  return NextResponse.json(result);
}
