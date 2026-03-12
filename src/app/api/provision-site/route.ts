import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { createSiteForUser } from "@/4-shared/api/builder/createSiteForUser";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Check if site exists for user
    const { data: existingSites, error: findError } = await supabase
      .from("sites")
      .select("id")
      .eq("owner_user_id", user.id)
      .limit(1);

    if (findError) {
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    if (existingSites && existingSites.length > 0) {
      // Site already exists, return it
      return NextResponse.json({ site: existingSites[0] }, { status: 200 });
    }

    // No site exists, create one
    const { data: profileData } = await supabaseAdmin
      .from("user_profiles")
      .select("preferred_language")
      .eq("id", user.id)
      .maybeSingle();

    const site = await createSiteForUser({
      id: user.id,
      email: user.email ?? null,
      preferredLanguage: profileData?.preferred_language ?? null,
    });
    return NextResponse.json({ site }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
