/**
 * Everything lives on this device. No account, no server, no database.
 *
 * For an app holding skin and cycle data that's the honest default, not a shortcut: the most
 * private place for this information is nowhere but the phone it was typed into.
 */
import { parseISO } from './cycle';
import { AM_STEPS, PM_STEPS, SKIN_TAGS, type DayLog, type SkinTag } from './log';
import { SKIN_TYPES, type SkinType } from './skin';

export interface Profile {
  /** Every period start you've logged, YYYY-MM-DD, ascending. Always at least one. */
  periodStarts: string[];
  cycleLength: number;
  periodLength: number;
  skinType: SkinType;
}

const PROFILE_KEY = 'skincycle:v1:profile';
// v2 replaced v1's morning/evening yes-or-no with individual routine steps. v1 logs only ever came
// from prototype testing, so they aren't migrated — but "delete all" still removes them.
const LOGS_KEY = 'skincycle:v2:logs';
const OLD_LOGS_KEY = 'skincycle:v1:logs';

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Full or blocked storage shouldn't take the app down with it.
  }
}

const isISO = (v: unknown): v is string => typeof v === 'string' && parseISO(v) !== null;

export function loadProfile(): Profile | null {
  const p = read(PROFILE_KEY) as
    | { periodStarts?: unknown; cycleLength?: unknown; periodLength?: unknown; skinType?: unknown }
    | null;
  if (!p || !Array.isArray(p.periodStarts)) return null;
  const periodStarts = [...new Set(p.periodStarts.filter(isISO))].sort();
  if (periodStarts.length === 0) return null;
  if (typeof p.cycleLength !== 'number' || typeof p.periodLength !== 'number') return null;
  // Profiles saved before skin type was asked get a neutral default rather than being thrown away.
  const skinType = SKIN_TYPES.find((t) => t.id === p.skinType)?.id ?? 'Normal';
  return { periodStarts, cycleLength: p.cycleLength, periodLength: p.periodLength, skinType };
}

export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);

export function loadLogs(): DayLog[] {
  const raw = read(LOGS_KEY);
  if (!Array.isArray(raw)) return [];

  return raw
    .flatMap((l): DayLog[] => {
      if (!l || !isISO(l.date)) return [];
      const skin = typeof l.skin === 'number' && l.skin >= 1 && l.skin <= 5 ? Math.round(l.skin) : null;
      const tags = Array.isArray(l.tags)
        ? l.tags.filter((t: unknown): t is SkinTag => (SKIN_TAGS as readonly unknown[]).includes(t))
        : [];
      return [
        {
          date: l.date,
          am: Array.isArray(l.am) ? AM_STEPS.filter((s) => l.am.includes(s)) : [],
          pm: Array.isArray(l.pm) ? PM_STEPS.filter((s) => l.pm.includes(s)) : [],
          homeCare: l.homeCare === true,
          skin,
          tags,
          note: typeof l.note === 'string' ? l.note.slice(0, 200) : '',
          sample: l.sample === true,
        },
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const saveLogs = (logs: DayLog[]) => write(LOGS_KEY, logs);

export function clearAllData() {
  try {
    [PROFILE_KEY, LOGS_KEY, OLD_LOGS_KEY].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nothing to clear */
  }
}
