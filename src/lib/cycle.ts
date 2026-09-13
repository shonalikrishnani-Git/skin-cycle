/**
 * The cycle model — the heart of the app.
 *
 * Phase boundaries SCALE with the length of your cycle. The first prototype hard-coded
 * days 1–5 / 6–11 / 12–16 / 17+, which is only right for a 28-day cycle: on a 35-day cycle it
 * called the luteal phase a week early. The luteal phase is the steadiest part of a cycle, at
 * roughly 14 days, so ovulation is counted back from the END of the cycle rather than forward
 * from the start.
 *
 * Every phase shown is an estimate from the dates you log. Not contraception, not a fertility
 * tool, not medical advice.
 */

export type Phase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export const PHASES: Phase[] = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'];

export interface PhaseMeta {
  /** Raw colour, for SVG. */
  stroke: string;
  /** Tailwind classes — written out in full so Tailwind can find them. */
  dot: string;
  soft: string;
  ink: string;
  border: string;
  hormone: string;
  skin: string;
  tip: string;
}

export const PHASE_META: Record<Phase, PhaseMeta> = {
  Menstrual: {
    stroke: 'var(--color-menstrual)',
    dot: 'bg-menstrual',
    soft: 'bg-menstrual-soft',
    ink: 'text-menstrual-ink',
    border: 'border-menstrual',
    hormone: 'Oestrogen and progesterone are at their lowest.',
    skin: 'Skin can feel drier, duller and more sensitive than usual.',
    tip: 'Go gentle — a mild cleanser and a richer moisturiser.',
  },
  Follicular: {
    stroke: 'var(--color-follicular)',
    dot: 'bg-follicular',
    soft: 'bg-follicular-soft',
    ink: 'text-follicular-ink',
    border: 'border-follicular',
    hormone: 'Oestrogen is rising.',
    skin: 'Skin is usually at its calmest and most resilient.',
    tip: 'The best week of the month to try a new product.',
  },
  Ovulatory: {
    stroke: 'var(--color-ovulatory)',
    dot: 'bg-ovulatory',
    soft: 'bg-ovulatory-soft',
    ink: 'text-ovulatory-ink',
    border: 'border-ovulatory',
    hormone: 'Oestrogen peaks.',
    skin: 'Often your best skin of the month — but oil starts to rise.',
    tip: 'Keep layers light, and don’t skip sunscreen.',
  },
  Luteal: {
    stroke: 'var(--color-luteal)',
    dot: 'bg-luteal',
    soft: 'bg-luteal-soft',
    ink: 'text-luteal-ink',
    border: 'border-luteal',
    hormone: 'Progesterone rises.',
    skin: 'Oil increases, and breakouts become more likely.',
    tip: 'Keep your routine steady — not the week to start something new.',
  },
};

// --- Dates -----------------------------------------------------------------------------
// Everything is a plain YYYY-MM-DD string, compared at UTC midnight, so time of day and
// daylight-saving changes can never move a date.

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Today in the user's own timezone. `new Date().toISOString()` is UTC, which in Irish summer
 * time reports yesterday's date for the first hour after midnight.
 */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parses YYYY-MM-DD strictly — "2026-02-31" is rejected rather than rolled into March. */
export function parseISO(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const check = new Date(t);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) {
    return null;
  }
  return t;
}

export function toISO(t: number): string {
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function addDays(iso: string, days: number): string {
  const t = parseISO(iso);
  return t === null ? iso : toISO(t + days * DAY_MS);
}

/** Whole days from `from` to `to`. Negative if `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const a = parseISO(from);
  const b = parseISO(to);
  return a === null || b === null ? 0 : Math.round((b - a) / DAY_MS);
}

// --- Phases ----------------------------------------------------------------------------

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export interface PhaseRange {
  phase: Phase;
  /** Inclusive cycle days. A range can be empty (start > end) on a very short cycle. */
  start: number;
  end: number;
}

export function phaseRanges(cycleLength: number, periodLength: number): PhaseRange[] {
  const length = clamp(Math.round(cycleLength), 15, 60);
  const period = clamp(Math.round(periodLength), 1, Math.min(10, length - 3));

  const ovulation = Math.max(period + 2, length - 14);
  const ovulatoryStart = Math.max(period + 1, ovulation - 2);
  const ovulatoryEnd = Math.min(length - 1, ovulation + 2);

  return [
    { phase: 'Menstrual', start: 1, end: period },
    { phase: 'Follicular', start: period + 1, end: ovulatoryStart - 1 },
    { phase: 'Ovulatory', start: ovulatoryStart, end: ovulatoryEnd },
    { phase: 'Luteal', start: ovulatoryEnd + 1, end: length },
  ];
}

export function phaseForDay(day: number, cycleLength: number, periodLength: number): Phase {
  const hit = phaseRanges(cycleLength, periodLength).find(
    (r) => r.start <= r.end && day >= r.start && day <= r.end,
  );
  // Past the expected length with no new period logged: still luteal until one arrives.
  return hit ? hit.phase : 'Luteal';
}

// --- Where a given date sits -------------------------------------------------------------

export interface CycleInfo {
  day: number;
  phase: Phase;
  /** The length used for this date: the real one if the next period is logged, else the usual. */
  cycleLength: number;
  /** True when inferred — before the first logged period, or in the future. */
  estimated: boolean;
  /** Days beyond the usual cycle length, for today in the current cycle. */
  late: number;
}

function sortedStarts(starts: string[]): string[] {
  return [...new Set(starts)].filter((s) => parseISO(s) !== null).sort();
}

export function cycleInfoFor(
  date: string,
  starts: string[],
  cycleLength: number,
  periodLength: number,
  today: string = todayISO(),
): CycleInfo | null {
  const known = sortedStarts(starts);
  if (known.length === 0 || parseISO(date) === null) return null;
  const usual = cycleLength;

  let index = -1;
  for (let i = known.length - 1; i >= 0; i--) {
    if (known[i] <= date) {
      index = i;
      break;
    }
  }

  // Before the first logged period: count backwards in usual-length cycles.
  if (index === -1) {
    const diff = daysBetween(known[0], date);
    const day = (((diff % usual) + usual) % usual) + 1;
    return { day, phase: phaseForDay(day, usual, periodLength), cycleLength: usual, estimated: true, late: 0 };
  }

  const start = known[index];
  const nextStart = known[index + 1];
  const elapsed = daysBetween(start, date);

  // A finished cycle: we know exactly how long it really was, so use that.
  if (nextStart) {
    const actual = daysBetween(start, nextStart);
    const day = elapsed + 1;
    return { day, phase: phaseForDay(day, actual, periodLength), cycleLength: actual, estimated: false, late: 0 };
  }

  // The current cycle, up to today.
  if (date <= today) {
    const day = elapsed + 1;
    return {
      day,
      phase: phaseForDay(day, usual, periodLength),
      cycleLength: usual,
      estimated: false,
      // Day usual+1 is the day the next period is DUE, not a late day — so lateness starts after it.
      // This must agree with nextPeriod(), which counts from the expected date.
      late: Math.max(0, day - usual - 1),
    };
  }

  // The future. If today is already late, the next period can't be predicted in the past —
  // assume it could come any day from tomorrow.
  const todayDay = daysBetween(start, today) + 1;
  const projectedNext = todayDay > usual ? addDays(today, 1) : addDays(start, usual);
  if (date < projectedNext) {
    const day = elapsed + 1;
    return { day, phase: phaseForDay(day, usual, periodLength), cycleLength: usual, estimated: true, late: 0 };
  }
  const day = (daysBetween(projectedNext, date) % usual) + 1;
  return { day, phase: phaseForDay(day, usual, periodLength), cycleLength: usual, estimated: true, late: 0 };
}

export interface NextPeriod {
  date: string;
  inDays: number;
  late: number;
}

export function nextPeriod(
  starts: string[],
  cycleLength: number,
  today: string = todayISO(),
): NextPeriod | null {
  const known = sortedStarts(starts);
  if (known.length === 0) return null;
  const expected = addDays(known[known.length - 1], cycleLength);
  const inDays = daysBetween(today, expected);
  return { date: expected, inDays: Math.max(0, inDays), late: Math.max(0, -inDays) };
}
