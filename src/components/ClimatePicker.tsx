import { CLIMATES, type ClimateId } from '../lib/advice';

/** The input no other skincare app asks for. */
export function ClimatePicker({
  value,
  onChange,
}: {
  value: ClimateId;
  onChange: (c: ClimateId) => void;
}) {
  return (
    <section aria-label="Today's conditions" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="text-xs uppercase tracking-widest text-muted mb-1">Today's air</h2>
      <p className="text-sm text-muted mb-4">Change this and the advice changes with it.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CLIMATES.map((c) => {
          const active = c.id === value;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(c.id)}
              className={`p-3 rounded-xl border text-left transition ${
                active ? 'border-accent bg-accent-soft' : 'border-line hover:border-muted'
              }`}
            >
              <span className="block text-sm font-medium">{c.label}</span>
              <span className="block text-xs text-muted mt-0.5">{c.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
