import { useEffect, useState } from 'react';
import { CYCLE_RANGE, PERIOD_RANGE, type Profile } from '../lib/storage';
import { ChevronIcon } from './Icons';
import { NumberStepper, SkinTypePicker } from './ProfileFields';
import { RoutineEditor } from './RoutineEditor';
import { SITE_HOME } from './Onboarding';

const CARD = 'bg-surface border border-line rounded-3xl p-6';
const H2 = 'font-display text-xl mb-4';

/**
 * Settings save as you go — there's nothing to lose by changing a skin type or a step. Period dates
 * aren't here: they're logged from Today and the diary, where they happen.
 */
export function Settings({
  profile,
  onChange,
  onClose,
  onDeleteAll,
  focus,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onClose: () => void;
  onDeleteAll: () => void;
  /** Jump straight to one section, e.g. from "Edit my routine steps" on Today. */
  focus?: 'routine';
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (focus) document.getElementById(focus)?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [focus]);

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-5 sm:p-8">
        <header className="flex items-center justify-between mb-5">
          <h1 className="font-display text-3xl">Settings</h1>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-5 rounded-full bg-ink text-white text-sm font-semibold hover:opacity-90 transition flex items-center gap-1"
          >
            Done
          </button>
        </header>
        <p className="text-sm text-muted mb-5 -mt-2">Changes save as you make them.</p>

        <main className="space-y-4">
          <section className={CARD} aria-labelledby="s-skin">
            <h2 id="s-skin" className={H2}>
              Your skin
            </h2>
            <SkinTypePicker hideLegend value={profile.skinType} onChange={(skinType) => onChange({ ...profile, skinType })} />
          </section>

          <section className={CARD} aria-labelledby="s-cycle">
            <h2 id="s-cycle" className={H2}>
              Your cycle
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <NumberStepper
                id="cycleLength"
                label="Cycle length"
                unit="days"
                value={profile.cycleLength}
                min={CYCLE_RANGE.min}
                max={CYCLE_RANGE.max}
                onChange={(cycleLength) => onChange({ ...profile, cycleLength })}
              />
              <NumberStepper
                id="periodLength"
                label="Period length"
                unit="days"
                value={profile.periodLength}
                min={PERIOD_RANGE.min}
                max={PERIOD_RANGE.max}
                onChange={(periodLength) => onChange({ ...profile, periodLength })}
              />
            </div>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              Log when a period starts from Today, or tap any past day in the Diary.
            </p>
          </section>

          <section id="routine" className={`${CARD} scroll-mt-4`} aria-labelledby="s-routine">
            <h2 id="s-routine" className={H2}>
              Your routine
            </h2>
            <p className="text-sm text-muted -mt-2 mb-5 leading-relaxed">
              Removing a step keeps it on the days you already logged it.
            </p>
            <RoutineEditor routine={profile.routine} onChange={(routine) => onChange({ ...profile, routine })} />
          </section>

          <section className={CARD} aria-labelledby="s-data">
            <h2 id="s-data" className={H2}>
              Your data
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Everything is stored in this browser on this device — no account, no server. Clearing your browser’s site
              data erases it too.
            </p>
            {confirmDelete ? (
              <div className="bg-menstrual-soft rounded-2xl p-4">
                <p className="text-sm mb-3">Delete your skin diary, routine and cycle dates? This can’t be undone.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={onDeleteAll} className="px-4 min-h-11 rounded-xl bg-menstrual-ink text-white text-sm font-semibold">
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
                className="min-h-11 px-4 rounded-xl border border-line text-sm text-menstrual-ink hover:bg-menstrual-soft transition"
              >
                Delete all my data
              </button>
            )}
          </section>

          <a
            href={SITE_HOME}
            className={`${CARD} flex items-center justify-between text-sm hover:border-muted/40 transition`}
          >
            <span>
              <span className="block font-semibold">About this project</span>
              <span className="block text-muted mt-0.5">How it was built and how the guidance was checked</span>
            </span>
            <ChevronIcon direction="right" className="text-muted shrink-0" />
          </a>
        </main>
      </div>
    </div>
  );
}
