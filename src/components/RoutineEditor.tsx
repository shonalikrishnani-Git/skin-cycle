import { useState } from 'react';
import { MAX_STEPS, MAX_STEP_LENGTH, SUGGESTED_STEPS, addStep, moveStep, type Routine } from '../lib/log';
import { ChevronIcon, MoonIcon, PlusIcon, SunIcon, XIcon } from './Icons';

const iconButton =
  'w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-canvas transition disabled:opacity-30 disabled:hover:bg-transparent';

function Half({
  id,
  title,
  icon,
  steps,
  suggestions,
  onChange,
}: {
  id: 'am' | 'pm';
  title: string;
  icon: React.ReactNode;
  steps: string[];
  suggestions: string[];
  onChange: (steps: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const full = steps.length >= MAX_STEPS;
  const unused = suggestions.filter((s) => !steps.some((x) => x.toLowerCase() === s.toLowerCase()));

  const addDraft = () => {
    const next = addStep(steps, draft);
    if (next !== steps) onChange(next);
    setDraft('');
  };

  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted mb-2">
        {icon} {title}
      </legend>

      {steps.length === 0 ? (
        <p className="text-sm text-muted mb-3">No steps yet — add one below.</p>
      ) : (
        <ol className="rounded-2xl border border-line divide-y divide-line mb-3 bg-surface">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center pl-3.5 pr-0.5 min-h-12">
              <span className="w-5 text-xs text-muted tabular-nums">{i + 1}</span>
              <span className="flex-1 text-sm min-w-0 truncate">{step}</span>
              <button
                type="button"
                className={iconButton}
                aria-label={`Move ${step} earlier`}
                disabled={i === 0}
                onClick={() => onChange(moveStep(steps, i, -1))}
              >
                <ChevronIcon direction="up" />
              </button>
              <button
                type="button"
                className={iconButton}
                aria-label={`Move ${step} later`}
                disabled={i === steps.length - 1}
                onClick={() => onChange(moveStep(steps, i, 1))}
              >
                <ChevronIcon direction="down" />
              </button>
              <button
                type="button"
                className={`${iconButton} hover:text-menstrual-ink`}
                aria-label={`Remove ${step}`}
                onClick={() => onChange(steps.filter((s) => s !== step))}
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ol>
      )}

      {!full && unused.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5" aria-label={`Suggested ${title.toLowerCase()} steps`}>
          {unused.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(addStep(steps, s))}
              className="min-h-10 pl-2.5 pr-3.5 rounded-full border border-dashed border-muted/60 text-[13px] text-muted hover:border-accent hover:text-accent transition flex items-center gap-1"
            >
              <PlusIcon /> {s}
            </button>
          ))}
        </div>
      )}

      {full ? (
        <p className="text-xs text-muted">That’s the most steps one routine can hold ({MAX_STEPS}).</p>
      ) : (
        <div className="flex gap-2">
          <label htmlFor={`own-${id}`} className="sr-only">
            Add your own {title.toLowerCase()} step
          </label>
          <input
            id={`own-${id}`}
            type="text"
            value={draft}
            maxLength={MAX_STEP_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDraft();
              }
            }}
            placeholder="Type your own step…"
            className="flex-1 min-w-0 min-h-11 px-3.5 rounded-2xl border border-line bg-canvas text-sm focus:outline-2 focus:outline-accent"
          />
          <button
            type="button"
            onClick={addDraft}
            disabled={!draft.trim()}
            className="min-h-11 px-4 rounded-2xl bg-ink text-white text-sm font-medium disabled:opacity-35 transition"
          >
            Add
          </button>
        </div>
      )}
    </fieldset>
  );
}

/** Your morning and evening steps: pick from suggestions or type your own, then put them in order. */
export function RoutineEditor({ routine, onChange }: { routine: Routine; onChange: (r: Routine) => void }) {
  return (
    <div className="space-y-7">
      <Half
        id="am"
        title="Morning"
        icon={<SunIcon className="text-muted" />}
        steps={routine.am}
        suggestions={SUGGESTED_STEPS.am}
        onChange={(am) => onChange({ ...routine, am })}
      />
      <Half
        id="pm"
        title="Evening"
        icon={<MoonIcon className="text-muted" />}
        steps={routine.pm}
        suggestions={SUGGESTED_STEPS.pm}
        onChange={(pm) => onChange({ ...routine, pm })}
      />
    </div>
  );
}
