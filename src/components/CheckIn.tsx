import {
  AM_STEPS,
  PM_STEPS,
  SKIN_SCORES,
  SKIN_TAGS,
  toggleStep,
  type DayLog,
  type SkinTag,
} from '../lib/log';
import { CheckIcon, FaceIcon, MoonIcon, SunIcon } from './Icons';

const LABEL = 'flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted mb-2';

const selectable = (on: boolean) =>
  on ? 'border-accent bg-accent-soft text-ink' : 'border-line text-muted hover:border-muted';

const chip = (on: boolean) => `min-h-11 px-4 rounded-full border text-[13px] transition ${selectable(on)}`;

/**
 * One day in the skin diary: which routine steps you did, whether you tried a home-care
 * treatment, how your skin felt, and anything worth noting.
 */
export function CheckIn({
  log,
  heading,
  subheading,
  onChange,
  periodToggle,
  justStarted,
}: {
  log: DayLog;
  heading: string;
  subheading?: string;
  onChange: (log: DayLog) => void;
  periodToggle?: { on: boolean; disabled: boolean; onToggle: () => void };
  /** True right after this day's sample data was replaced by a real (still mostly empty) entry. */
  justStarted?: boolean;
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
          <p className="text-xs text-ovulatory-ink mt-1">Sample entry — tap anything to start your own entry for this day.</p>
        )}
        {justStarted && !log.sample && (
          <p className="text-xs text-ovulatory-ink mt-1">
            Started your own entry — the sample steps you didn’t tap were cleared. Tap them again if you did them
            too.
          </p>
        )}
      </div>

      <div>
        <span className={LABEL}>
          <SunIcon className="text-muted" /> Morning
          <span className="ml-auto normal-case tracking-normal">
            {log.am.length} of {AM_STEPS.length}
          </span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {AM_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              aria-pressed={log.am.includes(step)}
              onClick={() => onChange({ ...log, am: toggleStep(AM_STEPS, log.am, step) })}
              className={chip(log.am.includes(step))}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={LABEL}>
          <MoonIcon className="text-muted" /> Evening
          <span className="ml-auto normal-case tracking-normal">
            {log.pm.length} of {PM_STEPS.length}
          </span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PM_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              aria-pressed={log.pm.includes(step)}
              onClick={() => onChange({ ...log, pm: toggleStep(PM_STEPS, log.pm, step) })}
              className={chip(log.pm.includes(step))}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={log.homeCare}
        onClick={() => onChange({ ...log, homeCare: !log.homeCare })}
        className={`w-full min-h-12 px-4 flex items-center justify-between rounded-2xl border text-sm transition ${selectable(log.homeCare)}`}
      >
        <span className="text-ink">Tried a home-care treatment</span>
        {log.homeCare ? <CheckIcon className="text-accent" /> : <span className="text-xs text-muted">optional</span>}
      </button>

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
                <span className={`text-xs ${on ? 'text-ink font-semibold' : 'text-muted'}`}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className={LABEL}>Noticed anything?</span>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={log.tags.includes(tag)}
              onClick={() => toggleTag(tag)}
              className={chip(log.tags.includes(tag))}
            >
              {tag}
            </button>
          ))}
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
          placeholder="New serum, oatmeal soak, bad sleep…"
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
