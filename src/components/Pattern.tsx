import { PHASE_META } from '../lib/cycle';
import { patternInsight, type PhaseSummary } from '../lib/log';

/** The payoff for all that tracking: how your skin has felt in each phase. */
export function Pattern({
  summaries,
  hasSample,
  onClearSample,
}: {
  summaries: PhaseSummary[];
  hasSample: boolean;
  onClearSample: () => void;
}) {
  const insight = patternInsight(summaries);

  return (
    <section aria-label="Your skin pattern" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">Your skin pattern</h2>
      <p className="text-sm text-muted mb-5">How your skin has felt in each phase, from what you've logged.</p>

      <ul className="space-y-4">
        {summaries.map((s) => {
          const meta = PHASE_META[s.phase];
          return (
            <li key={s.phase}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                  {s.phase}
                </span>
                <span className="text-xs text-muted">
                  {s.avgSkin === null
                    ? 'no ratings yet'
                    : `${s.avgSkin.toFixed(1)} / 5 · ${s.ratedDays} day${s.ratedDays === 1 ? '' : 's'}`}
                </span>
              </div>
              <div
                className="h-2 bg-line rounded-full overflow-hidden"
                role="progressbar"
                aria-label={`${s.phase} average skin rating`}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={s.avgSkin === null ? undefined : Number(s.avgSkin.toFixed(1))}
              >
                <div className={`h-full rounded-full ${meta.dot}`} style={{ width: `${((s.avgSkin ?? 0) / 5) * 100}%` }} />
              </div>
              {s.topTag && <p className="text-xs text-muted mt-1.5">Most logged: {s.topTag.toLowerCase()}</p>}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 pt-4 border-t border-line text-sm leading-relaxed">
        {insight.kind === 'not-enough' && (
          <p className="text-muted">
            Rate your skin on a few days in different phases, and your pattern will show up here.
          </p>
        )}
        {insight.kind === 'steady' && <p>Your skin has been fairly steady across your cycle so far.</p>}
        {insight.kind === 'pattern' && (
          <p>
            Your skin feels best in your{' '}
            <strong className={PHASE_META[insight.best].ink}>{insight.best.toLowerCase()}</strong> phase and
            hardest in your <strong className={PHASE_META[insight.worst].ink}>{insight.worst.toLowerCase()}</strong>{' '}
            phase
            {insight.worstTag && (
              <>
                {' '}
                — usually logged as <strong>{insight.worstTag.toLowerCase()}</strong>
              </>
            )}
            . Worth planning around.
          </p>
        )}
      </div>

      {hasSample && (
        <div className="mt-5 p-4 rounded-2xl bg-ovulatory-soft">
          <p className="text-xs text-ovulatory-ink leading-relaxed mb-2">
            <strong>This includes sample entries</strong> so there's something to see on day one. They aren't
            your data.
          </p>
          <button type="button" onClick={onClearSample} className="min-h-11 text-xs underline text-ovulatory-ink hover:opacity-70">
            Remove the sample entries
          </button>
        </div>
      )}
    </section>
  );
}
