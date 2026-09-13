import { PHASE_META, type CycleInfo, type NextPeriod } from '../lib/cycle';
import { CycleRing } from './CycleRing';

function nextText(next: NextPeriod | null): string {
  if (!next) return '';
  if (next.late > 0) {
    return `Your period is ${next.late} day${next.late === 1 ? '' : 's'} later than usual. Cycles vary — tap below when it starts.`;
  }
  if (next.inDays === 0) return 'Your period is expected today.';
  if (next.inDays === 1) return 'Next period expected tomorrow.';
  return `Next period in about ${next.inDays} days.`;
}

export function TodayCard({
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
    <section aria-label="Your cycle today" className="bg-surface border border-line rounded-3xl p-6">
      <CycleRing day={info.day} phase={info.phase} cycleLength={cycleLength} periodLength={periodLength} />

      <p className="text-center text-sm text-muted mt-3 leading-relaxed">{nextText(next)}</p>

      <div className={`mt-5 rounded-2xl p-4 ${meta.soft}`}>
        <p className={`text-xs uppercase tracking-widest mb-1.5 ${meta.ink}`}>Your skin this week</p>
        <p className="text-sm font-medium leading-relaxed">{meta.skin}</p>
        <p className="text-sm text-ink/75 leading-relaxed mt-1">{meta.tip}</p>
        <p className="text-xs text-ink/55 mt-2">{meta.hormone}</p>
      </div>

      <button
        type="button"
        onClick={onTogglePeriod}
        disabled={periodStartedToday && !canUndoPeriod}
        aria-pressed={periodStartedToday}
        className={`w-full mt-4 min-h-12 rounded-2xl border text-sm font-semibold transition disabled:opacity-60 ${
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
