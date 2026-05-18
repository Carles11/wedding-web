import { SEOService } from "@/4-shared/api/seo/seoService";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Vercel webhooks send data as a POST request payload
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.INDEXNOW_KEY) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only run if the incoming Vercel event is a successful production deployment
    const payload = await request.json();
    if (
      payload.type !== "deployment.succeeded" ||
      payload.payload.target !== "production"
    ) {
      return NextResponse.json({
        skipped: true,
        message: "Not a production success event.",
      });
    }

    // Broadcast all 11 languages for the core apex domain
    await SEOService.syncWithSearchEngines(["weddweb.com"], null, true, [
      ...SUPPORTED_LANGUAGES,
    ]);

    return NextResponse.json({
      success: true,
      message: "Marketing IndexNow sync completed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
