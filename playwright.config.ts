// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Only runs tests in e2e/
  testDir: "e2e",
  // OR, ignore all __tests__:
  testIgnore: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
});
