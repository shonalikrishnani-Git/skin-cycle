/**
 * Cycle day and phase.
 *
 * One function, used everywhere. In the original Gemini app this was calculated in two
 * different places with two different rounding rules, so the dashboard and the advice
 * disagreed by a day — and on a phase boundary that meant advice for the wrong week.
 * Keeping it in one place is the whole point.
 */

export type Phase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export const PHASES: { id: Phase; label: string; days: string; hormone: string }[] = [
  { id: 'Menstrual', label: 'Menstrual', days: 'Days 1–5', hormone: 'Oestrogen & progesterone low' },
  { id: 'Follicular', label: 'Follicular', days: 'Days 6–11', hormone: 'Oestrogen rising' },
  { id: 'Ovulatory', label: 'Ovulatory', days: 'Days 12–16', hormone: 'Oestrogen peaks' },
  { id: 'Luteal', label: 'Luteal', days: 'Days 17+', hormone: 'Progesterone rises' },
];

const MS_PER_DAY = 86_400_000;

/**
 * What day of the cycle is it today?
 *
 * Both dates are taken at midnight, so the answer doesn't change as the day goes on, and the
 * YYYY-MM-DD string is parsed by hand rather than through `new Date(string)`, which can shift
 * the date by one depending on timezone.
 *
 * Returns 1 for a missing, malformed, or future start date — a date in the future is a slip in
 * the date picker, not a cycle running backwards.
 */
export function getCycleDay(startDate: string | undefined, cycleLength = 28): number {
  if (!startDate) return 1;

  const parts = startDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return 1;
  const [year, month, day] = parts;

  const start = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  const elapsed = Math.round((today - start) / MS_PER_DAY);
  if (elapsed < 0) return 1;

  const length = cycleLength > 0 ? cycleLength : 28;
  return (elapsed % length) + 1;
}

/** Which phase a given cycle day falls in. Boundaries are inclusive. */
export function getPhase(cycleDay: number): Phase {
  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 11) return 'Follicular';
  if (cycleDay <= 16) return 'Ovulatory';
  return 'Luteal';
}

export function getPhaseInfo(phase: Phase) {
  return PHASES.find((p) => p.id === phase)!;
}
