import { useState } from 'react';
import { APP_NAME } from '../lib/brand';
import { addDays, ageOn, todayISO } from '../lib/cycle';
import { DEFAULT_ROUTINE, type Routine } from '../lib/log';
import type { SkinType } from '../lib/skin';
import { AGE_RANGE, CYCLE_RANGE, MAX_NAME_LENGTH, PERIOD_RANGE, type Profile } from '../lib/storage';
import { ChevronIcon, LogoMark } from './Icons';
import { BirthDateField, FIELD_LABEL, NameField, NumberStepper, SkinTypePicker } from './ProfileFields';
import { RoutineEditor } from './RoutineEditor';

/** How far back a "last period" can be. Older than this and the phase guidance can't fit. */
const MAX_DAYS_BACK = 90;

/** Where the landing page lives in the published build (the app sits in /app/). */
export const SITE_HOME = import.meta.env.PROD ? '../' : 'https://shonalikrishnani-git.github.io/skin-cycle/';

export const PRIMARY_BUTTON =
  'w-full min-h-13 rounded-2xl bg-accent text-white font-semibold shadow-[0_10px_24px_-12px_var(--color-accent)] hover:brightness-105 active:scale-[0.99] transition';

const STEPS = [
  { title: 'About you', colour: 'bg-menstrual' },
  { title: 'Your skin', colour: 'bg-follicular' },
  { title: 'Your cycle', colour: 'bg-ovulatory' },
  { title: 'Your routine', colour: 'bg-luteal' },
] as const;

/**
 * First run: four short steps, one per colour of the cycle. The landing page (site/) does the
 * explaining, so this goes straight to the questions. Nothing is saved until the last step.
 */
export function Onboarding({ onSave, onTour }: { onSave: (p: Profile) => void; onTour: () => void }) {
  const today = todayISO();
  const earliestPeriod = addDays(today, -MAX_DAYS_BACK);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [routine, setRoutine] = useState<Routine>({ am: [...DEFAULT_ROUTINE.am], pm: [...DEFAULT_ROUTINE.pm] });
  const [error, setError] = useState('');

  const age = birthDate ? ageOn(birthDate, today) : null;
  const clear = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setError('');
  };

  const go = (to: number) => {
    setError('');
    setStep(to);
    window.scrollTo(0, 0);
  };

  const next = () => {
    if (step === 0) {
      if (!name.trim()) return setError('Add your first name.');
      if (age === null) return setError('Add your date of birth.');
      if (age < AGE_RANGE.min) return setError(`${APP_NAME} is for ages ${AGE_RANGE.min} and up.`);
      if (age > AGE_RANGE.max) return setError('Check the year of your date of birth.');
    }
    if (step === 1 && !skinType) return setError('Pick the one closest to your skin.');
    if (step === 2) {
      if (!lastPeriod) return setError('Pick the day your last period started. A best guess is fine.');
      if (lastPeriod > today) return setError('That date is in the future.');
      // The GP line is SEE_SOMEONE's HSE-sourced wording, not a new claim.
      if (lastPeriod < earliestPeriod)
        return setError(
          'Pick a date in the last three months. Three missed periods in a row when you’re not pregnant is a reason to see a GP.',
        );
    }
    if (step < STEPS.length - 1) return go(step + 1);
    onSave({
      name: name.trim().slice(0, MAX_NAME_LENGTH),
      birthDate,
      periodStarts: [lastPeriod],
      cycleLength,
      periodLength,
      skinType: skinType!,
      routine,
    });
  };

  const last = step === STEPS.length - 1;
  const firstName = name.trim().split(' ')[0];

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-6 sm:py-12">
      <div className="w-full max-w-md flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5 min-h-11">
          {step === 0 ? (
            <a href={SITE_HOME} className="flex items-center gap-2 -ml-1 text-sm text-muted hover:text-ink transition">
              <LogoMark size={24} /> {APP_NAME}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="min-h-11 -ml-2 pl-1 pr-3 flex items-center gap-0.5 text-sm text-muted hover:text-ink transition"
            >
              <ChevronIcon direction="left" /> Back
            </button>
          )}
          <span className="text-xs text-muted tabular-nums">
            {step + 1} of {STEPS.length}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-8" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s.title} className="h-1.5 rounded-full bg-line overflow-hidden">
              <span
                className={`block h-full rounded-full ${s.colour} origin-left transition-transform duration-500 ease-out`}
                style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          className="flex-1 flex flex-col"
        >
          <section key={step} aria-labelledby="step-title" className="anim-slide-in">
            <h1 id="step-title" className="font-display text-[32px] leading-tight mb-6">
              {step === 0 && 'Let’s set up your diary'}
              {step === 1 && (firstName ? `${firstName}, what’s your skin like?` : 'What’s your skin like?')}
              {step === 2 && 'Your cycle'}
              {step === 3 && 'Your routine'}
            </h1>

            {step === 0 && (
              <div className="space-y-5">
                <NameField value={name} onChange={clear(setName)} />
                <BirthDateField value={birthDate} age={age} max={today} onChange={clear(setBirthDate)} />
              </div>
            )}

            {step === 1 && <SkinTypePicker value={skinType} hideLegend onChange={clear(setSkinType)} />}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="lastPeriod" className={FIELD_LABEL}>
                    Last period started
                  </label>
                  <input
                    id="lastPeriod"
                    type="date"
                    min={earliestPeriod}
                    max={today}
                    value={lastPeriod}
                    onChange={(e) => clear(setLastPeriod)(e.target.value)}
                    className="w-full min-h-13 px-4 rounded-2xl border border-line bg-surface text-[16px] focus:outline-2 focus:outline-accent"
                  />
                  <p className="text-xs text-muted mt-2">A best guess is fine.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberStepper
                    id="cycleLength"
                    label="Cycle length"
                    unit="days"
                    value={cycleLength}
                    min={CYCLE_RANGE.min}
                    max={CYCLE_RANGE.max}
                    onChange={setCycleLength}
                  />
                  <NumberStepper
                    id="periodLength"
                    label="Period length"
                    unit="days"
                    value={periodLength}
                    min={PERIOD_RANGE.min}
                    max={PERIOD_RANGE.max}
                    onChange={setPeriodLength}
                  />
                </div>
              </div>
            )}

            {step === 3 && <RoutineEditor routine={routine} onChange={setRoutine} />}
          </section>

          {error && (
            <p role="alert" className="anim-shake text-sm text-menstrual-ink mt-5">
              {error}
            </p>
          )}

          <div className="mt-auto pt-8 space-y-2">
            <button type="submit" className={PRIMARY_BUTTON}>
              {last ? 'Start my diary' : 'Continue'}
            </button>
            {step === 0 && (
              <button type="button" onClick={onTour} className="w-full min-h-11 text-sm text-muted hover:text-ink transition">
                Or see the demo first
              </button>
            )}
            {step === 0 && (
              <p className="text-xs text-muted text-center pt-2">
                Stays on this device. General skincare information, not medical advice.
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
