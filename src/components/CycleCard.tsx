import { PHASE_META, type CycleInfo, type NextPeriod } from '../lib/cycle';
import { CycleRing } from './CycleRing';

function nextText(next: NextPeriod | null): string {
  if (!next) return '';
  if (next.late > 0) return `${next.late} day${next.late === 1 ? '' : 's'} later than usual — cycles vary.`;
  if (next.inDays === 0) return 'Period expected today.';
  if (next.inDays === 1) return 'Period expected tomorrow.';
  return `Next period in about ${next.inDays} days.`;
}

/** The cycle, deliberately second: it's the context for the skin guidance, not the headline. */
export function CycleCard({
  info,
  next,
  cycleLength,
  periodLength,
  periodStartedToday,
  canUndoPeriod,
  onTogglePeriod,
}: {
  info: CycleInfo;
  next: NextPeriod | null;
  cycleLength: number;
  periodLength: number;
  periodStartedToday: boolean;
  canUndoPeriod: boolean;
  onTogglePeriod: () => void;
}) {
  const meta = PHASE_META[info.phase];

  return (
    <section aria-label="Your cycle" className="bg-surface border border-line rounded-3xl p-6">
      <div className="flex items-center gap-4">
        <div className="w-[124px] shrink-0">
          <CycleRing day={info.day} phase={info.phase} cycleLength={cycleLength} periodLength={periodLength} size={124} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Your cycle</p>
          <p className={`font-display text-xl leading-tight ${meta.ink}`}>{info.phase} phase</p>
          <p className="text-sm text-muted leading-relaxed mt-1">{nextText(next)}</p>
          <p className="text-xs text-ink/55 mt-1.5">{meta.hormone}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onTogglePeriod}
        disabled={periodStartedToday && !canUndoPeriod}
        aria-pressed={periodStartedToday}
        className={`w-full mt-5 min-h-12 rounded-2xl border text-sm font-semibold transition disabled:opacity-60 ${
          periodStartedToday
            ? 'border-menstrual bg-menstrual-soft text-menstrual-ink'
            : 'border-menstrual text-menstrual-ink hover:bg-menstrual-soft'
        }`}
      >
        {periodStartedToday ? (canUndoPeriod ? 'Period logged today · Undo' : 'Period logged today') : 'My period started today'}
      </button>

      <p className="text-[11px] text-muted text-center mt-4 leading-relaxed">
        Phases are estimates from the dates you log. Not for contraception or medical use.
      </p>
    </section>
  );
}
