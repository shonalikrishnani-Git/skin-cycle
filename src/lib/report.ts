/**
 * Skin Report — the same logs you've already kept, turned into one page you can read yourself
 * or hand to a pharmacist or GP. It never claims more than the diary can support: sample entries
 * are excluded everywhere, and the routine/skin comparison stays quiet below the same "quiet
 * until true" bar the pattern view uses (see MIN_RATED_DAYS / MIN_DIFFERENCE in log.ts) — a small
 * sample produces confident-sounding nonsense either way, so the threshold isn't allowed to drift.
 */
import { addDays } from './cycle';
import { MIN_DIFFERENCE, MIN_RATED_DAYS, summariseByPhase, type DayLog, type PhaseSummary, type SkinTag } from './log';
import type { Profile } from './storage';

export type ReportRange = '6w' | 'all';

/** A day counts as "did most of both routines" once it has at least this many AM and PM steps. */
const BOTH_ROUTINES_MIN_STEPS = 2;

export interface RoutineComparison {
  /** Average skin rating on days with at least BOTH_ROUTINES_MIN_STEPS steps in both AM and PM. */
  bothAvg: number;
  /** Average skin rating on every other rated day. */
  otherAvg: number;
}

export interface Report {
  from: string;
  to: string;
  loggedDays: number;
  /** Period starts logged within [from, to]. */
  periodsLogged: number;
  phases: PhaseSummary[];
  /** null until both groups clear MIN_RATED_DAYS and the gap clears MIN_DIFFERENCE. */
  routine: RoutineComparison | null;
  topTags: { tag: SkinTag; count: number }[];
  homeCareDays: number;
  notes: { date: string; note: string }[];
}

const didBothRoutines = (log: DayLog) =>
  log.am.length >= BOTH_ROUTINES_MIN_STEPS && log.pm.length >= BOTH_ROUTINES_MIN_STEPS;

function routineComparison(logs: DayLog[]): RoutineComparison | null {
  const rated = logs.filter((l) => l.skin !== null);
  const both = rated.filter(didBothRoutines);
  const other = rated.filter((l) => !didBothRoutines(l));
  if (both.length < MIN_RATED_DAYS || other.length < MIN_RATED_DAYS) return null;

  const avg = (group: DayLog[]) => group.reduce((sum, l) => sum + (l.skin ?? 0), 0) / group.length;
  const bothAvg = avg(both);
  const otherAvg = avg(other);
  if (Math.abs(bothAvg - otherAvg) < MIN_DIFFERENCE) return null;

  return { bothAvg, otherAvg };
}

/** '6w' is a fixed window; 'all' starts from the earliest thing she's actually logged. */
function rangeStart(real: DayLog[], profile: Profile, today: string, range: ReportRange): string {
  if (range === '6w') return addDays(today, -41); // 6 weeks including today
  const known = [...profile.periodStarts, ...real.map((l) => l.date)].sort();
  return known[0] ?? today;
}

export function buildReport(logs: DayLog[], profile: Profile, today: string, range: ReportRange): Report {
  const real = logs.filter((l) => !l.sample);
  const from = rangeStart(real, profile, today, range);
  const to = today;

  const inRange = real.filter((l) => l.date >= from && l.date <= to);
  const periodsLogged = profile.periodStarts.filter((d) => d >= from && d <= to).length;

  const tagCounts = new Map<SkinTag, number>();
  inRange.forEach((l) => l.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => ({ tag, count }));

  const notes = inRange.filter((l) => l.note.trim() !== '').map((l) => ({ date: l.date, note: l.note }));

  return {
    from,
    to,
    loggedDays: inRange.length,
    periodsLogged,
    phases: summariseByPhase(inRange, profile),
    routine: routineComparison(inRange),
    topTags,
    homeCareDays: inRange.filter((l) => l.homeCare).length,
    notes,
  };
}
