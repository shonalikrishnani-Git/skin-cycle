/**
 * Everything lives on this device. No account, no server, no database.
 *
 * For an app holding skin and cycle data that's the honest default, not a shortcut: the most
 * private place for this information is nowhere but the phone it was typed into.
 */
import { parseISO } from './cycle';
import { DEFAULT_ROUTINE, MAX_STEPS, SKIN_TAGS, addStep, type DayLog, type Routine, type SkinTag } from './log';
import { SKIN_TYPES, type SkinType } from './skin';

export interface Profile {
  /** Every period start you've logged, YYYY-MM-DD, ascending. Always at least one. */
  periodStarts: string[];
  cycleLength: number;
  periodLength: number;
  skinType: SkinType;
  /** Your own morning and evening steps, in the order you do them. */
  routine: Routine;
}

export const CYCLE_RANGE = { min: 21, max: 45 } as const;
export const PERIOD_RANGE = { min: 2, max: 10 } as const;

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

const inRange = (v: unknown, r: { min: number; max: number }): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= r.min && v <= r.max;

/** Any list of strings, cleaned and de-duplicated. Unknown step names are kept — they're yours. */
function readSteps(v: unknown, limit: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.reduce<string[]>((acc, s) => (typeof s === 'string' ? addStep(acc, s) : acc), []).slice(0, limit);
}

function readRoutine(v: unknown): Routine {
  const r = v as { am?: unknown; pm?: unknown } | null;
  const am = readSteps(r?.am, MAX_STEPS);
  const pm = readSteps(r?.pm, MAX_STEPS);
  // Profiles from before routines were editable get the routine the app used to have built in.
  return am.length || pm.length ? { am, pm } : { am: [...DEFAULT_ROUTINE.am], pm: [...DEFAULT_ROUTINE.pm] };
}

export function loadProfile(): Profile | null {
  const p = read(PROFILE_KEY) as
    | { periodStarts?: unknown; cycleLength?: unknown; periodLength?: unknown; skinType?: unknown; routine?: unknown }
    | null;
  if (!p || !Array.isArray(p.periodStarts)) return null;
  const periodStarts = [...new Set(p.periodStarts.filter(isISO))].sort();
  if (periodStarts.length === 0) return null;
  // Out-of-range lengths (only possible by editing storage by hand) would break the phase maths.
  if (!inRange(p.cycleLength, CYCLE_RANGE) || !inRange(p.periodLength, PERIOD_RANGE)) return null;
  // Profiles saved before skin type was asked get a neutral default rather than being thrown away.
  const skinType = SKIN_TYPES.find((t) => t.id === p.skinType)?.id ?? 'Normal';
  return {
    periodStarts,
    cycleLength: Math.round(p.cycleLength),
    periodLength: Math.round(p.periodLength),
    skinType,
    routine: readRoutine(p.routine),
  };
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
          // Up to 20: a day can hold steps you've since removed from your routine as well as current ones.
          am: readSteps(l.am, MAX_STEPS * 2),
          pm: readSteps(l.pm, MAX_STEPS * 2),
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
