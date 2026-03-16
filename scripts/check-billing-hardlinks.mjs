import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const appRoutePath = path.resolve(
  "src/app/(dashboard)/builder/[siteId]/account/billing/page.tsx",
);
const sourceComponentPath = path.resolve(
  "src/0-pages/(builder)/[siteId]/account/billing/AccountBillingPage.tsx",
);
const deprecatedPagesRoutePath = path.resolve(
  "src/0-pages/(builder)/[siteId]/account/billing/page.tsx",
);
const deprecatedAppCopyPath = path.resolve(
  "src/app/(dashboard)/builder/[siteId]/account/billing/AccountBillingPage.tsx",
);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const [appStats, sourceStats] = await Promise.all([
    stat(appRoutePath),
    stat(sourceComponentPath),
  ]);

  const samePhysicalFile =
    appStats.dev === sourceStats.dev && appStats.ino === sourceStats.ino;

  if (samePhysicalFile) {
    console.error("[billing-hardlink-check] Failed");
    console.error(
      "Dashboard billing route and 0-pages AccountBillingPage component are hardlinked to the same file.",
    );
    console.error(`- ${appRoutePath}`);
    console.error(`- ${sourceComponentPath}`);
    process.exit(1);
  }

  const appRouteContent = await readFile(appRoutePath, "utf8");
  const appNormalized = appRouteContent.trim().replace(/\r\n/g, "\n");
  const expectedReExport =
    'export { default } from "@/0-pages/(builder)/[siteId]/account/billing/AccountBillingPage";';

  const hasFullPageImplementationInRoute =
    appNormalized.includes("AccountBillingDetails") ||
    appNormalized.includes("fetchBuilderTranslations") ||
    appNormalized.includes("getCurrentUser") ||
    appNormalized.includes("export default async function");

  if (appNormalized !== expectedReExport || hasFullPageImplementationInRoute) {
    console.error("[billing-hardlink-check] Failed");
    console.error(
      "Dashboard billing route drift detected. App route must stay a one-line re-export to 0-pages AccountBillingPage.",
    );
    console.error(`- ${appRoutePath}`);
    console.error("Expected content:");
    console.error(expectedReExport);
    process.exit(1);
  }

  const sourceComponentContent = await readFile(sourceComponentPath, "utf8");
  const sourceNormalized = sourceComponentContent.trim().replace(/\r\n/g, "\n");
  const sourceHasImplementationMarkers =
    sourceNormalized.includes("AccountBillingPage") &&
    sourceNormalized.includes("AccountBillingDetails");

  if (!sourceHasImplementationMarkers) {
    console.error("[billing-hardlink-check] Failed");
    console.error(
      "0-pages AccountBillingPage source drift detected. It must contain the full implementation.",
    );
    console.error(`- ${sourceComponentPath}`);
    process.exit(1);
  }

  if (await exists(deprecatedPagesRoutePath)) {
    console.error("[billing-hardlink-check] Failed");
    console.error("Deprecated 0-pages billing route file still exists:");
    console.error(`- ${deprecatedPagesRoutePath}`);
    process.exit(1);
  }

  if (await exists(deprecatedAppCopyPath)) {
    console.error("[billing-hardlink-check] Failed");
    console.error("Duplicate app-level AccountBillingPage copy still exists:");
    console.error(`- ${deprecatedAppCopyPath}`);
    process.exit(1);
  }

  console.log("[billing-hardlink-check] OK: no hardlink coupling detected.");
}

main().catch((error) => {
  console.error("[billing-hardlink-check] Error:", error.message);
  process.exit(1);
});
