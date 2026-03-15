import type { WeddingGift } from "@/4-shared/types";

function hasText(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : false;
}

export function countWeddingGiftMethods(
  gift: Partial<WeddingGift> | null | undefined,
): number {
  if (!gift) return 0;

  let methods = 0;

  const hasBankTransfer =
    hasText(gift.bank_account_iban) ||
    hasText(gift.bank_account_swift) ||
    hasText(gift.bank_account_holder) ||
    hasText(gift.bank_name);

  if (hasBankTransfer) methods += 1;
  if (hasText(gift.paypal_url)) methods += 1;
  if (hasText(gift.bizum_phone)) methods += 1;
  if (hasText(gift.venmo_username)) methods += 1;
  if (hasText(gift.giftlist_url)) methods += 1;
  if (hasText(gift.honeymoon_fund_url)) methods += 1;
  if (hasText(gift.other_method_url) || hasText(gift.other_method_desc)) {
    methods += 1;
  }

  return methods;
}
