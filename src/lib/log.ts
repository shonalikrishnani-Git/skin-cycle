/**
 * The skin diary: what you did for your skin each day, how it felt, and what that adds up to.
 *
 * Every entry is placed in the cycle phase it happened in, so the pattern view can answer the
 * question this app exists for: how does my skin change through my month?
 */
import { PHASES, addDays, cycleInfoFor, type Phase } from './cycle';
import type { Profile } from './storage';

export const AM_STEPS = ['Cleanse', 'Serum', 'Moisturise', 'SPF'] as const;
export const PM_STEPS = ['Cleanse', 'Treatment', 'Moisturise'] as const;
export type AmStep = (typeof AM_STEPS)[number];
export type PmStep = (typeof PM_STEPS)[number];

export const SKIN_TAGS = ['Breakout', 'Oily', 'Dry', 'Dull', 'Sensitive', 'Redness'] as const;
export type SkinTag = (typeof SKIN_TAGS)[number];

/** Faces are drawn icons (components/Icons.tsx), so they look identical on every phone. */
export const SKIN_SCORES: { value: number; label: string }[] = [
  { value: 1, label: 'Rough' },
  { value: 2, label: 'Meh' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Glowing' },
];

export interface DayLog {
  date: string;
  am: AmStep[];
  pm: PmStep[];
  homeCare: boolean;
  /** 1–5, or null when not rated. Never defaulted — an untouched day must not count as "okay". */
  skin: number | null;
  tags: SkinTag[];
  note: string;
  sample?: boolean;
}

export function emptyLog(date: string): DayLog {
  return { date, am: [], pm: [], homeCare: false, skin: null, tags: [], note: '' };
}

function isBlank(log: DayLog): boolean {
  return (
    log.am.length === 0 &&
    log.pm.length === 0 &&
    !log.homeCare &&
    log.skin === null &&
    log.tags.length === 0 &&
    log.note.trim() === ''
  );
}

/** Insert or replace one day. Clearing everything on a day removes it, rather than storing an empty entry. */
export function upsertLog(logs: DayLog[], entry: DayLog): DayLog[] {
  const rest = logs.filter((l) => l.date !== entry.date);
  const next = isBlank(entry) ? rest : [...rest, entry];
  return next.sort((a, b) => a.date.localeCompare(b.date));
}

/** Toggle one routine step while keeping steps in routine order (cleanse before moisturise). */
export function toggleStep<T extends string>(order: readonly T[], current: T[], step: T): T[] {
  const chosen = new Set(current);
  if (chosen.has(step)) chosen.delete(step);
  else chosen.add(step);
  return order.filter((s) => chosen.has(s));
}

export const hasSample = (logs: DayLog[]) => logs.some((l) => l.sample);
export const withoutSample = (logs: DayLog[]) => logs.filter((l) => !l.sample);

// --- The pattern -----------------------------------------------------------------------

export interface PhaseSummary {
  phase: Phase;
  days: number;
  ratedDays: number;
  avgSkin: number | null;
  topTag: SkinTag | null;
}

export function summariseByPhase(logs: DayLog[], profile: Profile): PhaseSummary[] {
  const byPhase = new Map<Phase, DayLog[]>(PHASES.map((p) => [p, []]));

  for (const log of logs) {
    const info = cycleInfoFor(log.date, profile.periodStarts, profile.cycleLength, profile.periodLength);
    if (info) byPhase.get(info.phase)!.push(log);
  }

  return PHASES.map((phase) => {
    const inPhase = byPhase.get(phase)!;
    const rated = inPhase.filter((l) => l.skin !== null);
    const avgSkin = rated.length ? rated.reduce((sum, l) => sum + (l.skin ?? 0), 0) / rated.length : null;

    const counts = new Map<SkinTag, number>();
    inPhase.forEach((l) => l.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const topTag = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return { phase, days: inPhase.length, ratedDays: rated.length, avgSkin, topTag };
  });
}

export type Insight =
  | { kind: 'not-enough' }
  | { kind: 'steady' }
  | { kind: 'pattern'; best: Phase; worst: Phase; worstTag: SkinTag | null };

// Small samples produce confident-sounding nonsense. These keep the app quiet until there's
// actually something to say.
const MIN_RATED_DAYS = 3;
const MIN_DIFFERENCE = 0.5;

export function patternInsight(summaries: PhaseSummary[]): Insight {
  const usable = summaries.flatMap((s) =>
    s.avgSkin !== null && s.ratedDays >= MIN_RATED_DAYS ? [{ ...s, avg: s.avgSkin }] : [],
  );
  if (usable.length < 2) return { kind: 'not-enough' };

  const best = usable.reduce((a, b) => (b.avg > a.avg ? b : a));
  const worst = usable.reduce((a, b) => (b.avg < a.avg ? b : a));
  if (best.avg - worst.avg < MIN_DIFFERENCE) return { kind: 'steady' };

  return { kind: 'pattern', best: best.phase, worst: worst.phase, worstTag: worst.topTag };
}

// --- Sample history --------------------------------------------------------------------

/**
 * Eight weeks of sample entries, so the diary isn't empty on day one. Every entry is marked
 * `sample`, labelled on screen, and removable in one tap.
 *
 * The ratings deliberately carry NO cycle effect. An earlier version made skin "best at ovulation,
 * worst before a period" — a pattern the app's own Guide calls unproven — so the demo taught a myth.
 * Now ratings and tags vary on a 3- and 5-day rhythm that spreads evenly across every phase.
 */
export function sampleHistory(_profile: Profile, today: string, days = 56): DayLog[] {
  const logs: DayLog[] = [];

  for (let back = days; back >= 1; back--) {
    if (back % 6 === 0) continue; // a few skipped days, like a real person
    logs.push({
      date: addDays(today, -back),
      am: back % 7 === 0 ? [] : back % 3 === 0 ? ['Cleanse', 'Serum', 'Moisturise', 'SPF'] : ['Cleanse', 'Moisturise', 'SPF'],
      pm: back % 4 === 0 ? [] : back % 5 === 0 ? ['Cleanse', 'Treatment', 'Moisturise'] : ['Cleanse', 'Moisturise'],
      homeCare: back % 6 === 1,
      skin: 2 + ((back * 7) % 3), // 2, 3 or 4 — the same spread in every phase
      tags: back % 5 === 0 ? ['Oily'] : back % 7 === 0 ? ['Dry'] : [],
      note: '',
      sample: true,
    });
  }

  return logs;
}

const added = <T>(before: readonly T[], after: readonly T[]): T[] => after.filter((x) => !before.includes(x));

/**
 * Editing a sample day starts a REAL entry containing only what the user actually changed.
 * Previously the whole sample — made-up routine steps and tags included — became "hers", and
 * "Remove the sample entries" could no longer find it.
 */
export function adoptSampleEdit(sample: DayLog, edited: DayLog): DayLog {
  const fresh = emptyLog(sample.date);
  return {
    ...fresh,
    am: added(sample.am, edited.am),
    pm: added(sample.pm, edited.pm),
    homeCare: edited.homeCare !== sample.homeCare ? edited.homeCare : fresh.homeCare,
    skin: edited.skin !== sample.skin ? edited.skin : fresh.skin,
    tags: added(sample.tags, edited.tags),
    note: edited.note !== sample.note ? edited.note : fresh.note,
  };
}
