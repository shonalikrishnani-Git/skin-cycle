import { useState } from 'react';
import { PHASES, PHASE_META, cycleInfoFor, parseISO, toISO } from '../lib/cycle';
import { SKIN_SCORES, type DayLog } from '../lib/log';
import type { Profile } from '../lib/storage';
import { ChevronIcon, FaceIcon } from './Icons';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthName = new Intl.DateTimeFormat('en-IE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayName = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', timeZone: 'UTC' });

/**
 * The month at a glance: every day tinted by its phase, a face on every day you rated your skin.
 * Past days can be tapped to fill in or fix. Future days are faded — they're predictions.
 *
 * Padding and gaps are tight on purpose: seven columns on a 390px phone only reach the 44px
 * minimum tap size with a 12px card inset and 2px gutters.
 */
export function Calendar({
  profile,
  logs,
  today,
  selected,
  onSelect,
}: {
  profile: Profile;
  logs: DayLog[];
  today: string;
  selected: string;
  onSelect: (iso: string) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(parseISO(selected) ?? parseISO(today)!);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
  });

  const shift = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(Date.UTC(year, month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });

  const first = Date.UTC(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();
  const leadingBlanks = (new Date(first).getUTCDay() + 6) % 7; // Monday first

  const cells: (string | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(Date.UTC(cursor.year, cursor.month, i + 1))),
  ];

  const logByDate = new Map(logs.map((l) => [l.date, l]));
  const starts = new Set(profile.periodStarts);

  const navButton =
    'w-11 h-11 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink transition';

  return (
    <section aria-label="Calendar" className="bg-surface border border-line rounded-3xl px-3 py-4">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className={navButton}>
          <ChevronIcon direction="left" />
        </button>
        <h2 className="font-display text-xl">{monthName.format(first)}</h2>
        <button type="button" onClick={() => shift(1)} aria-label="Next month" className={navButton}>
          <ChevronIcon direction="right" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1.5" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-center text-[10px] uppercase tracking-wider text-muted">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((iso, i) => {
          if (!iso) return <div key={`blank-${i}`} />;

          const info = cycleInfoFor(iso, profile.periodStarts, profile.cycleLength, profile.periodLength, today);
          const meta = info ? PHASE_META[info.phase] : null;
          const future = iso > today;
          const isToday = iso === today;
          const log = logByDate.get(iso);
          const score = log?.skin ? SKIN_SCORES[log.skin - 1] : null;
          const predictedPeriod = future && info?.phase === 'Menstrual';

          const label = [
            dayName.format(parseISO(iso)!),
            info ? `${info.phase.toLowerCase()} phase` : '',
            score ? `skin ${score.label.toLowerCase()}` : '',
            starts.has(iso) ? 'period started' : '',
            isToday ? 'today' : '',
            future ? 'predicted' : '',
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <button
              key={iso}
              type="button"
              disabled={future}
              onClick={() => onSelect(iso)}
              aria-label={label}
              aria-pressed={iso === selected}
              className={[
                'relative aspect-square rounded-[10px] flex flex-col items-center justify-center gap-0.5 border-[1.5px] transition',
                meta ? meta.soft : 'bg-canvas',
                future ? 'opacity-50 cursor-default' : 'hover:brightness-95',
                predictedPeriod && meta
                  ? `border-dashed ${meta.border}`
                  : iso === selected
                    ? 'border-ink'
                    : 'border-transparent',
                // z-10 so the ring isn't painted over by the next cell along.
                isToday ? 'z-10 ring-2 ring-accent ring-offset-2 ring-offset-surface' : '',
              ].join(' ')}
            >
              <span className={`text-xs leading-none ${isToday ? 'font-bold' : ''}`}>{Number(iso.slice(8))}</span>
              {score ? (
                <FaceIcon level={score.value} size={14} className="text-ink" />
              ) : (
                <span className="h-3.5" aria-hidden="true" />
              )}
              {starts.has(iso) && (
                <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${PHASE_META.Menstrual.dot}`} />
              )}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-3.5 gap-y-1.5 mt-4 px-1">
        {PHASES.map((p) => (
          <li key={p} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`w-2.5 h-2.5 rounded-full ${PHASE_META[p].dot}`} aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-muted mt-2 px-1 leading-relaxed">
        Faded days are predictions · dashed = expected period · dot = a period you logged · ring = today. Tap any past
        day to fill it in.
      </p>
    </section>
  );
}
