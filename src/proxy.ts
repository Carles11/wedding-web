import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Handle Supabase auth/session logic globally
  return await updateSession(request);
}

// Required by Next.js 16 proxy system
export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
