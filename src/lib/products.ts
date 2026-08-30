/**
 * Product depletion — "when does this run out?"
 *
 * The idea most skincare apps miss: you don't forget your routine, you forget that the serum
 * ran out three weeks ago. Working from purchase date + expected lifespan turns that into
 * something visible.
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  purchaseDate: string; // YYYY-MM-DD
  lifespanDays: number;
}

export type DepletionStatus = 'fresh' | 'low' | 'empty';

export interface Depletion {
  daysUsed: number;
  daysLeft: number;
  percentUsed: number; // 0–100, clamped for the bar
  status: DepletionStatus;
}

const MS_PER_DAY = 86_400_000;

/** Whole days between a YYYY-MM-DD date and today, measured at midnight. Never negative. */
export function daysSince(dateStr: string): number {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return 0;
  const [y, m, d] = parts;
  const then = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - then) / MS_PER_DAY));
}

export function getDepletion(product: Product): Depletion {
  const lifespan = product.lifespanDays > 0 ? product.lifespanDays : 1;
  const daysUsed = daysSince(product.purchaseDate);
  const daysLeft = lifespan - daysUsed;
  const rawPercent = (daysUsed / lifespan) * 100;

  // 80% is the nudge point: enough time left to reorder before you actually run out.
  const status: DepletionStatus = rawPercent >= 100 ? 'empty' : rawPercent >= 80 ? 'low' : 'fresh';

  return {
    daysUsed,
    daysLeft,
    percentUsed: Math.min(100, Math.round(rawPercent)),
    status,
  };
}

export const CATEGORIES = ['Cleanser', 'Serum', 'Moisturiser', 'SPF', 'Treatment', 'Hair'];

/** Sensible default lifespans, so adding a product doesn't become a research task. */
export const DEFAULT_LIFESPAN: Record<string, number> = {
  Cleanser: 90,
  Serum: 60,
  Moisturiser: 75,
  SPF: 60,
  Treatment: 90,
  Hair: 120,
};
