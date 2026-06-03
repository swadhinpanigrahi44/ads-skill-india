/**
 * Business constants. All monetary values are in PAISE (integer).
 * ₹1 = 100 paise. Never use floats for money.
 */

// Withdrawals
export const MIN_WITHDRAWAL_PAISE = 50000; // ₹500

// Ads
export const AD_EARNING_PAISE = 1000; // ₹10 per verified ad
export const AD_MIN_WATCH_SECONDS = 30;
export const AD_FREE_LIFETIME_SESSIONS = 2;
export const AD_SUSPICIOUS_DAILY_IP_LIMIT = 3;

// KYC required document types (must match frontend upload steps)
export const KYC_REQUIRED_DOCS = [
  'AADHAAR_FRONT',
  'AADHAAR_BACK',
  'PAN_CARD',
  'BANK_PROOF',
] as const;

export type KycDocType = (typeof KYC_REQUIRED_DOCS)[number];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Convert paise (int) to a "123.45" rupee string. */
export function formatPaise(paise: number): string {
  return (paise / 100).toFixed(2);
}
