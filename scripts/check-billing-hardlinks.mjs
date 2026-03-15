import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const appPagePath = path.resolve(
  "src/app/(dashboard)/builder/[siteId]/account/billing/page.tsx",
);
const pagesPagePath = path.resolve(
  "src/0-pages/(builder)/[siteId]/account/billing/page.tsx",
);

async function main() {
  const [appStats, pagesStats] = await Promise.all([
    stat(appPagePath),
    stat(pagesPagePath),
  ]);

  const samePhysicalFile =
    appStats.dev === pagesStats.dev && appStats.ino === pagesStats.ino;

  if (samePhysicalFile) {
    console.error("[billing-hardlink-check] Failed");
    console.error(
      "Dashboard billing page and 0-pages billing page are hardlinked to the same file.",
    );
    console.error(`- ${appPagePath}`);
    console.error(`- ${pagesPagePath}`);
    console.error(
      "Break the hardlink by recreating one file, then keep app as a re-export and 0-pages as source.",
    );
    process.exit(1);
  }

  const appPageContent = await readFile(appPagePath, "utf8");
  const appNormalized = appPageContent.trim().replace(/\r\n/g, "\n");
  const expectedReExport =
    'export { default } from "@/0-pages/(builder)/[siteId]/account/billing/page";';

  const hasFullPageImplementation =
    appNormalized.includes("AccountBillingPage") ||
    appNormalized.includes("AccountBillingDetails") ||
    appNormalized.includes("fetchBuilderTranslations") ||
    appNormalized.includes("getCurrentUser");

  if (appNormalized !== expectedReExport || hasFullPageImplementation) {
    console.error("[billing-hardlink-check] Failed");
    console.error(
      "Dashboard billing route drift detected. App route must stay a one-line re-export.",
    );
    console.error(`- ${appPagePath}`);
    console.error("Expected content:");
    console.error(expectedReExport);
    process.exit(1);
  }

  console.log("[billing-hardlink-check] OK: no hardlink coupling detected.");
}

main().catch((error) => {
  console.error("[billing-hardlink-check] Error:", error.message);
  process.exit(1);
});
