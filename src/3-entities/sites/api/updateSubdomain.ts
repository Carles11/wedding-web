import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { isValidSubdomain } from "@/4-shared/utils/validations";

export async function updateSubdomain(siteId: string, subdomain: string) {
  const subdomainIsValid = isValidSubdomain(subdomain);
  if (!subdomainIsValid) throw new Error("Invalid or reserved subdomain");

  // 1. Load current domains from DB
  const { data: siteRow, error: fetchError } = await supabaseAdmin
    .from("sites")
    .select("domains")
    .eq("id", siteId)
    .maybeSingle();
  if (fetchError) throw new Error("Failed to fetch domains");

  // 2. Filter out localhost/test domains from old array, keep only real custom domains
  const oldDomains: string[] = siteRow?.domains ?? [];
  const customDomains = oldDomains.filter(
    (d) =>
      !d.endsWith(".localhost:3000") &&
      !d.endsWith(".weddweb.com") && // add any other default/test domains you want to remove on update
      !d.startsWith("www."),
  );

  // 3. Add new default domains for new subdomain (you can add prod too)
  const newDomains = [
    `${subdomain}.localhost:3000`,
    `www.${subdomain}.localhost:3000`,
    `${subdomain}.weddweb.com`,
    `www.${subdomain}.weddweb.com`,
    ...customDomains, // <--- this preserves user custom domains!
  ];

  // 4. Check for subdomain collision
  const { data: existing } = await supabaseAdmin
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .neq("id", siteId)
    .maybeSingle();
  if (existing) throw new Error("Subdomain already taken");

  // 5. Update both subdomain and domains as before
  const { error } = await supabaseAdmin
    .from("sites")
    .update({
      subdomain,
      domains: newDomains,
    })
    .eq("id", siteId);

  if (error) throw new Error("Failed to update subdomain & domains");
  return { success: true };
}
