import type { PhaseSummary } from '../lib/log';

/**
 * The payoff. Your logged days, grouped by cycle phase.
 *
 * This is the screen the tracking exists for — and the question no skin-only tracker answers:
 * not "how was my skin", but "how was my skin *at this point in my cycle*".
 */
export function LookBack({
  summaries,
  isSample,
  onClearSample,
}: {
  summaries: PhaseSummary[];
  isSample: boolean;
  onClearSample: () => void;
}) {
  const withData = summaries.filter((s) => s.entries > 0);

  const best = withData.reduce<PhaseSummary | null>(
    (acc, s) => (!acc || (s.averageScore ?? 0) > (acc.averageScore ?? 0) ? s : acc),
    null,
  );
  const worst = withData.reduce<PhaseSummary | null>(
    (acc, s) => (!acc || (s.averageScore ?? 5) < (acc.averageScore ?? 5) ? s : acc),
    null,
  );

  return (
    <section aria-label="Your patterns" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">Your pattern</h2>
      <p className="text-sm text-muted mb-5">How your skin has been, grouped by cycle phase.</p>

      {withData.length === 0 ? (
        <p className="text-sm text-muted py-6 text-center">
          Check in for a few days and your pattern will appear here.
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {summaries.map((s) => (
              <li key={s.phase}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm font-medium">{s.phase}</span>
                  <span className="text-xs text-muted">
                    {s.entries === 0
                      ? 'no entries yet'
                      : `${s.averageScore!.toFixed(1)} / 5 · ${s.entries} days`}
                  </span>
                </div>

                <div
                  className="h-2 bg-line rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={s.averageScore ? Math.round(s.averageScore * 20) : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${s.phase} average skin score`}
                >
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${((s.averageScore ?? 0) / 5) * 100}%` }}
                  />
                </div>

                {s.topTag && (
                  <p className="text-xs text-muted mt-1.5">
                    Most noted: {s.topTag}
                    {s.routineRate !== null && ` · routine kept ${Math.round(s.routineRate * 100)}%`}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {best && worst && best.phase !== worst.phase && (
            <p className="text-sm leading-relaxed mt-6 pt-4 border-t border-line">
              Your skin reads best in your <strong>{best.phase}</strong> phase and hardest in your{' '}
              <strong>{worst.phase}</strong> phase
              {worst.topTag && <> — usually noted as <strong>{worst.topTag.toLowerCase()}</strong></>}.
              That's the week to be gentle, not the week to start something new.
            </p>
          )}

          {isSample && (
            <div className="mt-5 p-3.5 rounded-2xl bg-warn-soft border border-warn/25">
              <p className="text-xs text-warn leading-relaxed mb-2">
                <strong>This is sample history</strong>, generated so the pattern has something to show.
                It is not your data.
              </p>
              <button
                type="button"
                onClick={onClearSample}
                className="text-xs underline text-warn hover:opacity-70"
              >
                Clear it and start my own
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
