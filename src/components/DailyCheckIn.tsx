import { SCORE_LABELS, SKIN_TAGS, type DayLog, type SkinTag } from '../lib/log';

/** Today's entry. Three taps if you're in a hurry: AM, PM, and how your skin feels. */
export function DailyCheckIn({
  log,
  onChange,
}: {
  log: DayLog;
  onChange: (l: DayLog) => void;
}) {
  const toggleTag = (tag: SkinTag) =>
    onChange({
      ...log,
      tags: log.tags.includes(tag) ? log.tags.filter((t) => t !== tag) : [...log.tags, tag],
    });

  return (
    <section aria-label="Today's check-in" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">Check in</h2>
      <p className="text-sm text-muted mb-5">Ten seconds. It's what makes the look-back worth reading.</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['am', 'pm'] as const).map((slot) => {
          const done = slot === 'am' ? log.amDone : log.pmDone;
          return (
            <button
              key={slot}
              type="button"
              aria-pressed={done}
              onClick={() =>
                onChange(slot === 'am' ? { ...log, amDone: !done } : { ...log, pmDone: !done })
              }
              className={`p-4 rounded-2xl border text-left transition ${
                done ? 'border-accent bg-accent-soft' : 'border-line hover:border-muted'
              }`}
            >
              <span className="block text-sm font-medium">
                {slot === 'am' ? 'Morning routine' : 'Evening routine'}
              </span>
              <span className="block text-xs text-muted mt-0.5">{done ? 'Done ✓' : 'Not yet'}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <span className="block text-xs uppercase tracking-widest text-muted mb-2">
          How is your skin today?
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              aria-pressed={log.skinScore === score}
              aria-label={SCORE_LABELS[score]}
              onClick={() => onChange({ ...log, skinScore: score })}
              className={`flex-1 py-2.5 rounded-xl border text-xs transition ${
                log.skinScore === score
                  ? 'border-accent bg-accent-soft font-medium'
                  : 'border-line text-muted hover:border-muted'
              }`}
            >
              {SCORE_LABELS[score]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-xs uppercase tracking-widest text-muted mb-2">
          Anything to note? (optional)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TAGS.map((tag) => {
            const on = log.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full border text-xs transition ${
                  on ? 'border-accent bg-accent-soft' : 'border-line text-muted hover:border-muted'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
