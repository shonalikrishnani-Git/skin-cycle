import { useState } from 'react';
import { SKIN_TYPES, CLIMATES, type SkinType, type ClimateId } from '../lib/advice';
import type { Profile } from '../lib/storage';

/** First run. Three questions, because three is what the advice engine actually needs. */
export function Setup({ onDone }: { onDone: (p: Profile) => void }) {
  const [skinType, setSkinType] = useState<SkinType>('Combination');
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [climate, setClimate] = useState<ClimateId>('cold_dry');

  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-surface border border-line rounded-3xl p-7 shadow-sm">
        <h1 className="font-display text-3xl mb-1.5">Let's set you up</h1>
        <p className="text-muted text-sm mb-7 leading-relaxed">
          Three questions. Everything stays on this device — nothing is sent anywhere.
        </p>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onDone({ skinType, cycleStartDate, cycleLength, climate });
          }}
        >
          <div>
            <label htmlFor="skinType" className="block text-xs uppercase tracking-widest text-muted mb-2">
              Your skin, most days
            </label>
            <select
              id="skinType"
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as SkinType)}
              className="w-full p-3 rounded-xl border border-line bg-canvas focus:outline-2 focus:outline-accent"
            >
              {SKIN_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cycleStart" className="block text-xs uppercase tracking-widest text-muted mb-2">
              Last cycle start date
            </label>
            <input
              id="cycleStart"
              type="date"
              value={cycleStartDate}
              onChange={(e) => setCycleStartDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-line bg-canvas focus:outline-2 focus:outline-accent"
            />
            <p className="text-xs text-muted mt-1.5">Leave blank to skip cycle-based advice.</p>
          </div>

          <div>
            <label htmlFor="cycleLength" className="block text-xs uppercase tracking-widest text-muted mb-2">
              Usual cycle length (days)
            </label>
            <input
              id="cycleLength"
              type="number"
              min={20}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-line bg-canvas focus:outline-2 focus:outline-accent"
            />
          </div>

          <div>
            <span className="block text-xs uppercase tracking-widest text-muted mb-2">
              The air around you today
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CLIMATES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={climate === c.id}
                  onClick={() => setClimate(c.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    climate === c.id
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-canvas hover:border-muted'
                  }`}
                >
                  <span className="block text-sm font-medium">{c.label}</span>
                  <span className="block text-xs text-muted mt-0.5">{c.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3.5 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition"
          >
            Show me today
          </button>
        </form>
      </div>
    </main>
  );
}
