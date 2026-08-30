import { PHASES, type Phase } from '../lib/cycle';

/** Where you are in the month, and what that means hormonally. */
export function PhaseStrip({ day, phase }: { day: number; phase: Phase }) {
  return (
    <section aria-label="Cycle position" className="bg-surface border border-line rounded-3xl p-6">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl">Day {day}</h2>
        <span className="text-xs uppercase tracking-widest text-accent font-medium">{phase}</span>
      </div>

      <ol className="grid grid-cols-4 gap-1.5">
        {PHASES.map((p) => {
          const active = p.id === phase;
          return (
            <li key={p.id}>
              <div
                aria-current={active ? 'step' : undefined}
                className={`h-1.5 rounded-full mb-2 ${active ? 'bg-accent' : 'bg-line'}`}
              />
              <span className={`block text-xs font-medium ${active ? 'text-ink' : 'text-muted'}`}>
                {p.label}
              </span>
              <span className="block text-[11px] text-muted">{p.days}</span>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-muted mt-5 pt-4 border-t border-line">
        {PHASES.find((p) => p.id === phase)!.hormone}
      </p>
    </section>
  );
}
