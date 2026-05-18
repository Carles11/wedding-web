// src/4-shared/helpers/billing/geoCurrency.ts

export interface LocalizedPrice {
  price: number;
  currency: string;
}

const countryToCurrencyMap: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  CH: "CHF",
  HK: "HKD",
  TW: "TWD",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  CN: "CNY",
  BR: "BRL",
  MX: "MXN",
  RU: "RUB",
  CL: "CLP",
  UY: "UYU",
  CR: "CRC",
  PE: "PEN",
  IN: "INR",
  CO: "COP",
  AR: "ARS",
  EG: "EGP",
  BO: "BOB",
  DO: "DOP",
  GT: "GTQ",
  HN: "HNL",
  NI: "NIO",
  PA: "USD",
  PY: "PYG",
  MA: "MAD",
  ES: "EUR",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  AT: "EUR",
  BE: "EUR",
  NL: "EUR",
};

const LOCALIZED_PREMIUM_PRICES: Record<string, LocalizedPrice> = {
  EUR: { price: 39.0, currency: "EUR" },
  USD: { price: 39.0, currency: "USD" },
  GBP: { price: 35.0, currency: "GBP" },
  CAD: { price: 49.0, currency: "CAD" },
  AUD: { price: 59.0, currency: "AUD" },
  CHF: { price: 39.0, currency: "CHF" },
  HKD: { price: 299.0, currency: "HKD" },
  TWD: { price: 999.0, currency: "TWD" },
  AED: { price: 149.0, currency: "AED" },
  SAR: { price: 149.0, currency: "SAR" },
  QAR: { price: 149.0, currency: "QAR" },
  CNY: { price: 249.0, currency: "CNY" },
  BRL: { price: 149.0, currency: "BRL" },
  MXN: { price: 599.0, currency: "MXN" },
  RUB: { price: 2999.0, currency: "RUB" },
  CLP: { price: 29990.0, currency: "CLP" },
  UYU: { price: 1290.0, currency: "UYU" },
  CRC: { price: 17900.0, currency: "CRC" },
  PEN: { price: 119.0, currency: "PEN" },
  INR: { price: 1499.0, currency: "INR" },
  COP: { price: 119900.0, currency: "COP" },
  ARS: { price: 19999.0, currency: "ARS" },
  EGP: { price: 1190.0, currency: "EGP" },
  BOB: { price: 199.0, currency: "BOB" },
  DOP: { price: 1990.0, currency: "DOP" },
  GTQ: { price: 229.0, currency: "GTQ" },
  HNL: { price: 699.0, currency: "HNL" },
  NIO: { price: 899.0, currency: "NIO" },
  PYG: { price: 229000.0, currency: "PYG" },
  MAD: { price: 299.0, currency: "MAD" },
};

export function getPriceForCountry(countryCode: string | null): LocalizedPrice {
  if (!countryCode) return LOCALIZED_PREMIUM_PRICES.EUR;
  const currency = countryToCurrencyMap[countryCode.toUpperCase()] || "EUR";
  return LOCALIZED_PREMIUM_PRICES[currency] || LOCALIZED_PREMIUM_PRICES.EUR;
}

export function formatLocalPrice(
  price: number,
  currency: string,
  lang: string,
): string {
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2, // Cleans up trailing .00 for cleaner display
  }).format(price);
}
