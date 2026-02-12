import { updateSession } from "@/4-shared/lib/supabase/middleware";
import { type NextRequest } from "next/server";

/**
 * Root middleware for the entire Next.js app.
 *
 * - Refreshes Supabase auth sessions on every request
 * - Protects /builder and /dashboard routes (redirects to /login if not authenticated)
 * - Runs on all routes except static files and API endpoints
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
