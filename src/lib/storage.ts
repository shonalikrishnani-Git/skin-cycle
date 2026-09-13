/**
 * Everything lives on this device. No account, no server, no database.
 *
 * For an app holding cycle data that's the honest default, not a shortcut: the most private
 * place for this information is nowhere but the phone it was typed into.
 *
 * Keys are versioned (`v1`). Older prototypes stored a different shape under different keys, and
 * reading them as this shape would crash — so they're simply ignored.
 */
import { parseISO } from './cycle';
import { SKIN_TAGS, type DayLog, type SkinTag } from './log';

export interface Profile {
  /** Every period start you've logged, YYYY-MM-DD, ascending. Always at least one. */
  periodStarts: string[];
  cycleLength: number;
  periodLength: number;
}

const PROFILE_KEY = 'skincycle:v1:profile';
const LOGS_KEY = 'skincycle:v1:logs';

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
  const p = read(PROFILE_KEY) as { periodStarts?: unknown; cycleLength?: unknown; periodLength?: unknown } | null;
  if (!p || !Array.isArray(p.periodStarts)) return null;
  const periodStarts = [...new Set(p.periodStarts.filter(isISO))].sort();
  if (periodStarts.length === 0) return null;
  if (typeof p.cycleLength !== 'number' || typeof p.periodLength !== 'number') return null;
  return { periodStarts, cycleLength: p.cycleLength, periodLength: p.periodLength };
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
          amDone: l.amDone === true,
          pmDone: l.pmDone === true,
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
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LOGS_KEY);
  } catch {
    /* nothing to clear */
  }
}
