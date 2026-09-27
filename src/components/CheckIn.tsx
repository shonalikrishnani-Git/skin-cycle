import { SKIN_SCORES, SKIN_TAGS, toggleStep, type DayLog, type Routine, type SkinTag } from '../lib/log';
import { CheckIcon, FaceIcon, MoonIcon, SunIcon } from './Icons';

const LABEL = 'flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted mb-2';

const selectable = (on: boolean) =>
  on ? 'border-accent bg-accent-soft text-ink' : 'border-line text-muted hover:border-muted';

const chip = (on: boolean) => `min-h-11 px-4 rounded-full border text-[13px] transition ${selectable(on)}`;

/** One half of the routine: your steps in order, plus any logged that day that you've since removed. */
function Steps({
  icon,
  title,
  order,
  done,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  order: string[];
  done: string[];
  onChange: (steps: string[]) => void;
}) {
  const removed = done.filter((s) => !order.includes(s));
  const count = done.filter((s) => order.includes(s)).length;
  return (
    <div>
      <span className={LABEL}>
        {icon} {title}
        <span className="ml-auto normal-case tracking-normal">
          {order.length ? `${count} of ${order.length}` : 'no steps yet'}
        </span>
      </span>
      <div className="flex flex-wrap gap-1.5">
        {[...order, ...removed].map((step) => (
          <button
            key={step}
            type="button"
            aria-pressed={done.includes(step)}
            onClick={() => onChange(toggleStep(order, done, step))}
            className={chip(done.includes(step))}
            title={order.includes(step) ? undefined : 'No longer in your routine'}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  routine,
  onEditRoutine,
}: {
  log: DayLog;
  routine: Routine;
  onEditRoutine?: () => void;
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

      <Steps
        icon={<SunIcon className="text-muted" />}
        title="Morning"
        order={routine.am}
        done={log.am}
        onChange={(am) => onChange({ ...log, am })}
      />
      <Steps
        icon={<MoonIcon className="text-muted" />}
        title="Evening"
        order={routine.pm}
        done={log.pm}
        onChange={(pm) => onChange({ ...log, pm })}
      />
      {onEditRoutine && (
        <button
          type="button"
          onClick={onEditRoutine}
          className="-mt-3 self-start min-h-11 text-xs text-accent underline underline-offset-4 hover:opacity-75"
        >
          Edit my routine steps
        </button>
      )}

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
