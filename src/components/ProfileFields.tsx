import { SKIN_TYPES, type SkinType } from '../lib/skin';
import { PlusIcon } from './Icons';

/** Shared by first-run setup and Settings, so both ask the same questions the same way. */

export const FIELD_LABEL = 'block text-xs uppercase tracking-widest text-muted mb-2';

export function SkinTypePicker({
  value,
  onChange,
  legend = 'Your skin, most days',
  hideLegend = false,
}: {
  value: SkinType | null;
  onChange: (t: SkinType) => void;
  legend?: string;
  hideLegend?: boolean;
}) {
  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : FIELD_LABEL}>{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {SKIN_TYPES.map((t) => {
          const on = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(t.id)}
              className={`min-h-16 px-3.5 py-3 rounded-2xl border-[1.5px] text-left transition ${
                on ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-muted/50'
              }`}
            >
              <span className={`block text-[15px] ${on ? 'font-semibold' : 'font-medium'}`}>{t.id}</span>
              <span className="block text-xs text-muted mt-0.5 leading-snug">{t.hint}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** A number you nudge rather than type, so it can never be out of range. */
export function NumberStepper({
  id,
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  const button =
    'w-11 h-11 rounded-full border border-line bg-surface flex items-center justify-center text-ink hover:border-muted/60 transition disabled:opacity-30';
  return (
    <div role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className={FIELD_LABEL}>
        {label}
      </span>
      <div className="flex items-center justify-between gap-1 rounded-2xl border border-line bg-canvas p-1">
        <button type="button" className={button} aria-label={`${label}: one day fewer`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <MinusIcon />
        </button>
        <output aria-live="polite" className="text-center">
          <span className="font-display text-2xl tabular-nums">{value}</span>
          <span className="text-xs text-muted ml-1">{unit}</span>
        </output>
        <button type="button" className={button} aria-label={`${label}: one day more`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
