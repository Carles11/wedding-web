export const dynamic = "force-dynamic";

/**
 * Fallback root page handler. The primary redirect logic is handled
 * upstream by the server proxy boundary layer inside src/proxy.ts
 */
export default async function RootPage() {
  return null;
}
