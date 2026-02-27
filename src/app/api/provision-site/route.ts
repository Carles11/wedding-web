import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createSiteForUser } from "@/4-shared/api/builder/createSiteForUser";

export async function POST() {
  // 1. Await cookies()
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 2. Use getAll & setAll for cookie methods
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {}, // If you don't set cookies server-side, leave as noop
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const site = await createSiteForUser({
      id: user.id,
      email: user.email ?? null,
    });
    return NextResponse.json({ site }, { status: 201 });
  } catch (e: unknown) {
    // console.error("Provision error (route.ts):", e); // This makes sure it prints!
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
