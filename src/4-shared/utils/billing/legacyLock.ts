// src/4-shared/utils/billing/legacyLock.ts
import { AccountInfo } from "@/4-shared/types";

export function ensureNotLegacy(account: AccountInfo | null) {
  if (!account) return;
  if (account.plan_type === "premium") return;

  // Fix: Provide a fallback string so Date() never receives null
  const lastActivity = new Date(
    account.last_activity_at ?? new Date().toISOString(),
  );

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  if (lastActivity < cutoff) {
    throw new Error("LEGACY_MODE_ACTIVE");
  }
}
