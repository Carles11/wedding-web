// scripts/cleanup-localhost-domains.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

type SiteRow = {
  id: string;
  subdomain: string | null;
  domains: string[];
};

// --- Supabase Setup ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Main Logic ---
async function main() {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");

  if (isApply) {
    console.log("WARNING: --apply flag detected. This will WRITE to the database.\n");
  } else {
    console.log("DRY RUN mode — no changes will be made.\n");
  }

  // 1. Fetch all sites
  const { data: sites, error } = await supabase
    .from("sites")
    .select("id, subdomain, domains");

  if (error) {
    throw new Error("Failed to fetch sites: " + error.message);
  }

  const rows = sites as SiteRow[];
  console.log(`Scanned ${rows.length} site rows.\n`);

  // 2. Find rows with localhost domains
  const affected: Array<{ site: SiteRow; oldDomains: string[]; newDomains: string[] }> = [];

  for (const site of rows) {
    if (!Array.isArray(site.domains)) continue;

    const hasLocalhost = site.domains.some(
      (d) => typeof d === "string" && d.includes("localhost"),
    );
    if (!hasLocalhost) continue;

    const cleaned = site.domains.filter(
      (d) => typeof d === "string" && !d.includes("localhost"),
    );

    affected.push({
      site,
      oldDomains: site.domains,
      newDomains: cleaned,
    });
  }

  if (affected.length === 0) {
    console.log("No sites with localhost domains found. Nothing to do.");
    process.exit(0);
  }

  // 3. Print diff
  console.log(`Found ${affected.length} site(s) with localhost entries:\n`);

  for (const { site, oldDomains, newDomains } of affected) {
    console.log(`  Site ID:      ${site.id}`);
    console.log(`  Subdomain:    ${site.subdomain ?? "(none)"}`);
    console.log(`  Old domains:  ${JSON.stringify(oldDomains)}`);
    console.log(`  New domains:  ${JSON.stringify(newDomains)}`);
    console.log("");
  }

  if (!isApply) {
    console.log(`DRY RUN: ${affected.length} site(s) would be updated.`);
    console.log("Run with --apply to perform the updates.");
    process.exit(0);
  }

  // 4. Apply updates
  console.log(`Applying updates to ${affected.length} site(s)...\n`);
  let updatedCount = 0;

  for (const { site, newDomains } of affected) {
    const { error: updateError } = await supabase
      .from("sites")
      .update({ domains: newDomains })
      .eq("id", site.id);

    if (updateError) {
      console.error(`  FAILED site ${site.id}: ${updateError.message}`);
    } else {
      console.log(`  UPDATED site ${site.id} (${site.subdomain})`);
      updatedCount++;
    }
  }

  // 5. Summary
  console.log(`\nSummary: ${rows.length} scanned, ${affected.length} had localhost entries, ${updatedCount} updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
