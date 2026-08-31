/**
 * The daily check-in, and what it's for.
 *
 * Tracking is only worth the effort if it eventually tells you something. So every entry is
 * stamped with the cycle day it happened on — which is what lets the look-back answer the
 * question competitors don't: "is my skin actually worse in the week before my period?"
 */
import { getCycleDay, getPhase, type Phase } from './cycle';

export interface DayLog {
  date: string; // YYYY-MM-DD
  amDone: boolean;
  pmDone: boolean;
  skinScore: number; // 1 = angry, 5 = happy
  tags: SkinTag[];
  note?: string;
}

export const SKIN_TAGS = ['Breakout', 'Dry', 'Oily', 'Sensitive', 'Calm'] as const;
export type SkinTag = (typeof SKIN_TAGS)[number];

export const SCORE_LABELS: Record<number, string> = {
  1: 'Angry',
  2: 'Unsettled',
  3: 'Fine',
  4: 'Good',
  5: 'Happy',
};

const LOGS_KEY = 'skincare-app:logs';
const SEEDED_KEY = 'skincare-app:logs-are-sample';

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadLogs(): DayLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as DayLog[]) : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs: DayLog[]) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    /* full or blocked storage shouldn't crash the app */
  }
}

export const historyIsSample = () => localStorage.getItem(SEEDED_KEY) === '1';
export const markSampleCleared = () => localStorage.removeItem(SEEDED_KEY);

export function emptyLog(date = todayISO()): DayLog {
  return { date, amDone: false, pmDone: false, skinScore: 3, tags: [] };
}

export function upsertLog(logs: DayLog[], entry: DayLog): DayLog[] {
  const rest = logs.filter((l) => l.date !== entry.date);
  return [...rest, entry].sort((a, b) => a.date.localeCompare(b.date));
}

// --- The look-back ------------------------------------------------------------------

export interface PhaseSummary {
  phase: Phase;
  entries: number;
  averageScore: number | null;
  topTag: SkinTag | null;
  routineRate: number | null; // 0–1, share of possible AM+PM routines completed
}

/**
 * Group every logged day by the cycle phase it fell in.
 *
 * Each entry is re-dated against the cycle start rather than trusting a stored phase, so
 * correcting your cycle start date correctly re-sorts your history.
 */
export function summariseByPhase(
  logs: DayLog[],
  cycleStartDate: string | undefined,
  cycleLength: number,
): PhaseSummary[] {
  const phases: Phase[] = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'];

  return phases.map((phase) => {
    const inPhase = logs.filter((l) => {
      const day = getCycleDayFor(l.date, cycleStartDate, cycleLength);
      return day !== null && getPhase(day) === phase;
    });

    if (inPhase.length === 0) {
      return { phase, entries: 0, averageScore: null, topTag: null, routineRate: null };
    }

    const averageScore = inPhase.reduce((sum, l) => sum + l.skinScore, 0) / inPhase.length;

    const counts = new Map<SkinTag, number>();
    inPhase.forEach((l) => l.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const topTag =
      [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const done = inPhase.reduce((sum, l) => sum + (l.amDone ? 1 : 0) + (l.pmDone ? 1 : 0), 0);

    return {
      phase,
      entries: inPhase.length,
      averageScore,
      topTag,
      routineRate: done / (inPhase.length * 2),
    };
  });
}

/** Cycle day for a past date — the same maths as today, measured from that date instead. */
function getCycleDayFor(
  dateStr: string,
  cycleStartDate: string | undefined,
  cycleLength: number,
): number | null {
  if (!cycleStartDate) return null;

  const parse = (s: string) => {
    const p = s.split('-').map(Number);
    return p.length === 3 && !p.some(Number.isNaN) ? Date.UTC(p[0], p[1] - 1, p[2]) : null;
  };

  const start = parse(cycleStartDate);
  const when = parse(dateStr);
  if (start === null || when === null) return null;

  const elapsed = Math.round((when - start) / 86_400_000);
  const length = cycleLength > 0 ? cycleLength : 28;
  // A day before the recorded cycle start still belongs to a cycle — wrap it round.
  return (((elapsed % length) + length) % length) + 1;
}

/**
 * Six weeks of plausible sample history, so the look-back has something to show on day one.
 * Clearly labelled as sample in the UI — an empty chart teaches nothing, and a fake one that
 * pretends to be real teaches the wrong thing.
 */
export function sampleHistory(cycleStartDate: string, cycleLength: number): DayLog[] {
  const logs: DayLog[] = [];
  const today = new Date();

  for (let back = 41; back >= 1; back--) {
    const d = new Date(today);
    d.setDate(d.getDate() - back);
    const date = d.toISOString().split('T')[0];

    const day = getCycleDay(date, cycleLength) || 1;
    const phase = getPhase(
      getCycleDayFor(date, cycleStartDate, cycleLength) ?? day,
    );

    // Deterministic wobble so the sample looks lived-in rather than perfectly smooth.
    const wobble = ((back * 37) % 5) / 4 - 0.5;

    let score: number;
    let tags: SkinTag[];
    switch (phase) {
      case 'Luteal':
        score = 2 + wobble;
        tags = back % 3 === 0 ? ['Breakout', 'Oily'] : ['Oily'];
        break;
      case 'Menstrual':
        score = 2.5 + wobble;
        tags = back % 2 === 0 ? ['Dry', 'Sensitive'] : ['Sensitive'];
        break;
      case 'Follicular':
        score = 4 + wobble;
        tags = ['Calm'];
        break;
      default:
        score = 4.5 + wobble;
        tags = back % 4 === 0 ? ['Oily'] : ['Calm'];
    }

    logs.push({
      date,
      amDone: (back * 7) % 10 !== 0,
      pmDone: (back * 3) % 4 !== 0,
      skinScore: Math.max(1, Math.min(5, Math.round(score))),
      tags,
    });
  }

  localStorage.setItem(SEEDED_KEY, '1');
  return logs;
}
