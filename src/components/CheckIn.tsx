import { SKIN_SCORES, SKIN_TAGS, type DayLog, type SkinTag } from '../lib/log';
import { CheckIcon, FaceIcon, MoonIcon, SunIcon } from './Icons';

const LABEL = 'block text-xs uppercase tracking-widest text-muted mb-2';

const selectable = (on: boolean) =>
  on ? 'border-accent bg-accent-soft text-ink' : 'border-line text-muted hover:border-muted';

/** One day's entry. Tap a face and you're done; everything else is optional. */
export function CheckIn({
  log,
  heading,
  subheading,
  onChange,
  periodToggle,
}: {
  log: DayLog;
  heading: string;
  subheading?: string;
  onChange: (log: DayLog) => void;
  periodToggle?: { on: boolean; disabled: boolean; onToggle: () => void };
}) {
  const toggleTag = (tag: SkinTag) =>
    onChange({
      ...log,
      tags: log.tags.includes(tag) ? log.tags.filter((t) => t !== tag) : [...log.tags, tag],
    });

  return (
    <section aria-label={heading} className="bg-surface border border-line rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">{heading}</h2>
        {subheading && <p className="text-sm text-muted">{subheading}</p>}
        {log.sample && (
          <p className="text-xs text-ovulatory-ink mt-1">Sample entry — anything you change becomes yours.</p>
        )}
      </div>

      <div>
        <span className={LABEL}>How does your skin feel?</span>
        <div className="grid grid-cols-5 gap-1.5">
          {SKIN_SCORES.map((s) => {
            const on = log.skin === s.value;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ ...log, skin: on ? null : s.value })}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition ${
                  on ? 'border-accent bg-accent-soft' : 'border-line hover:border-muted'
                }`}
              >
                <FaceIcon level={s.value} className={on ? 'text-accent' : 'text-muted'} />
                <span className={`text-[11px] ${on ? 'text-ink font-semibold' : 'text-muted'}`}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className={LABEL}>Routine</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={log.amDone}
            onClick={() => onChange({ ...log, amDone: !log.amDone })}
            className={`min-h-12 px-3.5 flex items-center gap-2.5 rounded-2xl border text-sm transition ${selectable(log.amDone)}`}
          >
            <SunIcon className={log.amDone ? 'text-accent' : 'text-muted'} />
            <span className="text-ink">Morning</span>
            {log.amDone && <CheckIcon className="ml-auto text-accent" />}
          </button>
          <button
            type="button"
            aria-pressed={log.pmDone}
            onClick={() => onChange({ ...log, pmDone: !log.pmDone })}
            className={`min-h-12 px-3.5 flex items-center gap-2.5 rounded-2xl border text-sm transition ${selectable(log.pmDone)}`}
          >
            <MoonIcon className={log.pmDone ? 'text-accent' : 'text-muted'} />
            <span className="text-ink">Evening</span>
            {log.pmDone && <CheckIcon className="ml-auto text-accent" />}
          </button>
        </div>
      </div>

      <div>
        <span className={LABEL}>Noticed anything?</span>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TAGS.map((tag) => {
            const on = log.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(tag)}
                className={`min-h-11 px-4 rounded-full border text-[13px] transition ${selectable(on)}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor={`note-${log.date}`} className={LABEL}>
          Note <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id={`note-${log.date}`}
          type="text"
          maxLength={120}
          value={log.note}
          onChange={(e) => onChange({ ...log, note: e.target.value })}
          placeholder="New serum, bad sleep, stressful week…"
          className="w-full min-h-12 px-3.5 rounded-2xl border border-line bg-canvas text-sm focus:outline-2 focus:outline-accent"
        />
      </div>

      {periodToggle && (
        <button
          type="button"
          onClick={periodToggle.onToggle}
          disabled={periodToggle.disabled}
          aria-pressed={periodToggle.on}
          className={`w-full min-h-12 rounded-2xl border text-sm transition disabled:opacity-60 ${
            periodToggle.on
              ? 'border-menstrual bg-menstrual-soft text-menstrual-ink'
              : 'border-line text-muted hover:border-menstrual hover:text-menstrual-ink'
          }`}
        >
          {periodToggle.on ? 'Period started this day' : 'My period started this day'}
        </button>
      )}
    </section>
  );
}
