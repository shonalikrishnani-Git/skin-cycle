/** Shared look for the Guide and Sources views, kept in one place so both stay in sync. */
import type { Evidence } from '../lib/skin';

export const CARD = 'bg-surface border border-line rounded-3xl p-6';

export const EVIDENCE_STYLE: Record<Evidence, string> = {
  'Good evidence': 'bg-follicular-soft text-follicular-ink',
  'Some evidence': 'bg-ovulatory-soft text-ovulatory-ink',
  'Dermatologist advice': 'bg-luteal-soft text-luteal-ink',
  'Low risk, little evidence': 'bg-surface text-muted border border-line',
};
