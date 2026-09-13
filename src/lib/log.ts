/**
 * The daily log, and what it adds up to.
 *
 * Tracking only earns its ten seconds if it eventually tells you something — so every entry is
 * placed in the cycle phase it happened in, and the pattern view answers the one question this
 * app exists for: does my skin change with my cycle?
 */
import { PHASES, addDays, cycleInfoFor, type Phase } from './cycle';
import type { Profile } from './storage';

export const SKIN_TAGS = ['Breakout', 'Oily', 'Dry', 'Sensitive', 'Redness'] as const;
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
  amDone: boolean;
  pmDone: boolean;
  /** 1–5, or null when not rated. Never defaulted — an untouched day must not count as "okay". */
  skin: number | null;
  tags: SkinTag[];
  note: string;
  sample?: boolean;
}

export function emptyLog(date: string): DayLog {
  return { date, amDone: false, pmDone: false, skin: null, tags: [], note: '' };
}

function isBlank(log: DayLog): boolean {
  return !log.amDone && !log.pmDone && log.skin === null && log.tags.length === 0 && log.note.trim() === '';
}

/** Insert or replace one day. Clearing everything on a day removes it, rather than storing an empty entry. */
export function upsertLog(logs: DayLog[], entry: DayLog): DayLog[] {
  const rest = logs.filter((l) => l.date !== entry.date);
  const next = isBlank(entry) ? rest : [...rest, entry];
  return next.sort((a, b) => a.date.localeCompare(b.date));
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

// Small samples produce confident-sounding nonsense. These thresholds keep the app quiet
// until there's actually something to say.
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

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Eight weeks of plausible sample entries, so the calendar and pattern aren't empty on day one.
 * Every entry is marked `sample`, labelled on screen, and removable in one tap. Editing a sample
 * day turns it into a real one.
 */
export function sampleHistory(profile: Profile, today: string, days = 56): DayLog[] {
  const logs: DayLog[] = [];

  for (let back = days; back >= 1; back--) {
    if (back % 6 === 0) continue; // a few skipped days, like a real person
    const date = addDays(today, -back);
    const info = cycleInfoFor(date, profile.periodStarts, profile.cycleLength, profile.periodLength, today);
    if (!info) continue;

    const wobble = ((back * 37) % 5) / 4 - 0.5;
    let skin: number;
    let tags: SkinTag[];
    switch (info.phase) {
      case 'Menstrual':
        skin = 2.6 + wobble;
        tags = back % 2 ? ['Dry'] : ['Dry', 'Sensitive'];
        break;
      case 'Follicular':
        skin = 4.1 + wobble;
        tags = [];
        break;
      case 'Ovulatory':
        skin = 4.5 + wobble;
        tags = back % 3 ? [] : ['Oily'];
        break;
      default:
        skin = 2.3 + wobble;
        tags = back % 3 ? ['Oily'] : ['Breakout', 'Oily'];
    }

    logs.push({
      date,
      amDone: (back * 7) % 10 !== 0,
      pmDone: (back * 3) % 4 !== 0,
      skin: clamp(Math.round(skin), 1, 5),
      tags,
      note: '',
      sample: true,
    });
  }

  return logs;
}
