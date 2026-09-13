import { useState } from 'react';
import { todayISO } from '../lib/cycle';
import { SKIN_TYPES, type SkinType } from '../lib/skin';
import type { Profile } from '../lib/storage';

/**
 * First run and settings share one form. Skin comes first because this is a skincare app; the
 * cycle questions are what let the guidance fit the week. Settings leaves period dates alone —
 * those are logged from Today and the diary, where they happen.
 */
export function Setup({
  profile,
  onSave,
  onClose,
  onDeleteAll,
}: {
  profile?: Profile;
  onSave: (p: Profile) => void;
  onClose?: () => void;
  onDeleteAll?: () => void;
}) {
  const firstRun = !profile;
  const today = todayISO();

  const [skinType, setSkinType] = useState<SkinType | null>(profile?.skinType ?? null);
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(profile?.cycleLength ?? 28);
  const [periodLength, setPeriodLength] = useState(profile?.periodLength ?? 5);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skinType) return setError('Pick the skin type that sounds most like you.');
    if (firstRun && !lastPeriod) return setError('Pick the day your last period started.');
    if (firstRun && lastPeriod > today) return setError('That date is in the future — pick the day it last started.');

    const cycle = Math.round(cycleLength);
    const period = Math.round(periodLength);
    if (!(cycle >= 21 && cycle <= 45)) return setError('Cycles are usually between 21 and 45 days.');
    if (!(period >= 2 && period <= 10)) return setError('Periods usually last between 2 and 10 days.');

    onSave({
      periodStarts: profile ? profile.periodStarts : [lastPeriod],
      cycleLength: cycle,
      periodLength: period,
      skinType,
    });
  };

  const field = 'w-full min-h-12 px-3 rounded-2xl border border-line bg-canvas focus:outline-2 focus:outline-accent';
  const label = 'block text-xs uppercase tracking-widest text-muted mb-2';

  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-md py-6">
        {firstRun && (
          <div className="text-center mb-7">
            <div className="flex justify-center gap-1.5 mb-5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-menstrual" />
              <span className="w-3 h-3 rounded-full bg-follicular" />
              <span className="w-3 h-3 rounded-full bg-ovulatory" />
              <span className="w-3 h-3 rounded-full bg-luteal" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">Skin Cycle</p>
            <h1 className="font-display text-4xl leading-tight mb-3 text-balance">Skincare that follows your cycle.</h1>
            <p className="text-muted leading-relaxed text-pretty">
              Track your routine and how your skin feels, and get simple, safe guidance for every week of your month.
            </p>
          </div>
        )}

        <form onSubmit={submit} noValidate className="bg-surface border border-line rounded-3xl p-6 space-y-6 shadow-sm">
          {!firstRun && <h1 className="font-display text-3xl">Settings</h1>}

          <div>
            <span className={label}>Your skin, most days</span>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_TYPES.map((t) => {
                const on = skinType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setSkinType(t.id);
                      setError('');
                    }}
                    className={`min-h-14 px-3 py-2.5 rounded-2xl border text-left transition ${
                      on ? 'border-accent bg-accent-soft' : 'border-line hover:border-muted'
                    }`}
                  >
                    <span className={`block text-sm ${on ? 'font-semibold' : ''}`}>{t.id}</span>
                    <span className="block text-xs text-muted mt-0.5">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {firstRun && (
            <div>
              <label htmlFor="lastPeriod" className={label}>
                When did your last period start?
              </label>
              <input
                id="lastPeriod"
                type="date"
                max={today}
                value={lastPeriod}
                onChange={(e) => {
                  setLastPeriod(e.target.value);
                  setError('');
                }}
                className={field}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cycleLength" className={label}>
                Cycle length
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="cycleLength"
                  type="number"
                  min={21}
                  max={45}
                  value={cycleLength}
                  onChange={(e) => {
                    setCycleLength(Number(e.target.value));
                    setError('');
                  }}
                  className={field}
                />
                <span className="text-sm text-muted">days</span>
              </div>
            </div>
            <div>
              <label htmlFor="periodLength" className={label}>
                Period length
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="periodLength"
                  type="number"
                  min={2}
                  max={10}
                  value={periodLength}
                  onChange={(e) => {
                    setPeriodLength(Number(e.target.value));
                    setError('');
                  }}
                  className={field}
                />
                <span className="text-sm text-muted">days</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted -mt-3">Not sure? 28 and 5 are fine to start with.</p>

          {error && (
            <p role="alert" className="text-sm text-menstrual-ink">
              {error}
            </p>
          )}

          <button type="submit" className="w-full min-h-12 rounded-2xl bg-accent text-white font-semibold hover:opacity-90 transition">
            {firstRun ? 'Start my skin diary' : 'Save'}
          </button>

          {!firstRun && (
            <button type="button" onClick={onClose} className="w-full min-h-11 text-sm text-muted hover:text-ink transition">
              Cancel
            </button>
          )}
        </form>

        {firstRun && (
          <p className="text-xs text-muted text-center mt-4 leading-relaxed">
            No account. Everything stays on this device.
          </p>
        )}

        {!firstRun && onDeleteAll && (
          <div className="mt-4 text-center">
            {confirmDelete ? (
              <div className="bg-menstrual-soft rounded-2xl p-4">
                <p className="text-sm mb-3">Delete your skin diary and cycle dates? This can’t be undone.</p>
                <div className="flex justify-center gap-2">
                  <button type="button" onClick={onDeleteAll} className="px-4 min-h-11 rounded-xl bg-menstrual-ink text-white text-sm">
                    Delete everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 min-h-11 rounded-xl border border-line bg-surface text-sm"
                  >
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="min-h-11 px-3 text-xs text-muted hover:text-menstrual-ink transition"
              >
                Delete all my data
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
