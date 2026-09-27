import { useState } from 'react';
import { APP_NAME } from '../lib/brand';
import { addDays, todayISO } from '../lib/cycle';
import { DEFAULT_ROUTINE, type Routine } from '../lib/log';
import { PILL_NOTE, SOURCES, type SkinType } from '../lib/skin';
import { CYCLE_RANGE, PERIOD_RANGE, type Profile } from '../lib/storage';
import { BookIcon, CalendarIcon, ChevronIcon, DropIcon, LockIcon, LogoMark } from './Icons';
import { FIELD_LABEL, NumberStepper, SkinTypePicker } from './ProfileFields';
import { RoutineEditor } from './RoutineEditor';

/** How far back a "last period" can be. Older than this and the phase guidance can't fit. */
const MAX_DAYS_BACK = 90;

/** Where the landing and about pages live in the published build (the app sits in /app/). */
export const SITE_HOME = import.meta.env.PROD ? '../' : 'https://shonalikrishnani-git.github.io/skin-cycle/';

const primary =
  'w-full min-h-13 rounded-2xl bg-accent text-white font-semibold shadow-[0_6px_20px_-8px_var(--color-accent)] hover:brightness-105 active:translate-y-px transition disabled:opacity-40 disabled:shadow-none';
const secondary =
  'w-full min-h-13 rounded-2xl border-[1.5px] border-line bg-surface text-ink font-semibold hover:border-muted/50 transition';

function Feature({
  icon,
  tint,
  title,
  children,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5 items-start">
      <span className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center ${tint}`}>{icon}</span>
      <div>
        <p className="text-[15px] font-semibold leading-snug">{title}</p>
        <p className="text-sm text-muted leading-relaxed mt-0.5">{children}</p>
      </div>
    </li>
  );
}

/** The first page: what the app is, that it's private, and two ways in. */
function Welcome({ onStart, onTour }: { onStart: () => void; onTour: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-8 sm:py-16">
      <div className="w-full max-w-md flex-1 flex flex-col">
        <div className="flex items-center gap-2.5 mb-8">
          <LogoMark size={30} />
          <span className="font-display text-lg">{APP_NAME}</span>
        </div>

        <h1 className="font-display text-[40px] leading-[1.08] tracking-tight text-balance mb-4">
          Skincare that follows your cycle.
        </h1>
        <p className="text-[17px] text-muted leading-relaxed text-pretty mb-8">
          Your menstrual cycle can nudge your skin. Get tips for each week and keep a quick skin diary.
        </p>

        <ul className="space-y-4 mb-7">
          <Feature icon={<DropIcon />} tint="bg-menstrual-soft text-menstrual-ink" title="What your skin needs this week">
            Tips matched to your skin type.
          </Feature>
          <Feature icon={<BookIcon />} tint="bg-follicular-soft text-follicular-ink" title="Advice you can check">
            Every tip is backed by a source — {SOURCES.length} in all.
          </Feature>
          <Feature icon={<CalendarIcon />} tint="bg-luteal-soft text-luteal-ink" title="A two-tap diary">
            Tick your routine, rate your skin, see your pattern.
          </Feature>
        </ul>

        <div className="flex items-start gap-3 rounded-2xl bg-surface border border-line p-4 mb-7">
          <LockIcon className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong className="font-semibold">Private by design.</strong>{' '}
            <span className="text-muted">No account. Your data stays on this device.</span>
          </p>
        </div>

        <div className="space-y-2.5 mt-auto">
          <button type="button" onClick={onStart} className={primary}>
            Set up my diary
          </button>
          <button type="button" onClick={onTour} className={secondary}>
            Take the 1-minute tour
          </button>
        </div>

        <p className="text-xs text-muted text-center leading-relaxed mt-6 text-pretty">
          General skincare information, not medical advice or contraception.{' '}
          <a href={SITE_HOME} className="underline underline-offset-2 hover:text-ink whitespace-nowrap">
            About this project
          </a>
        </p>
      </div>
    </main>
  );
}

const STEPS = ['Your skin', 'Your cycle', 'Your routine'] as const;
const STEP_COLOURS = ['bg-menstrual', 'bg-follicular', 'bg-luteal'];

/** First run: a welcome page, then three short questions. Nothing is saved until the last one. */
export function Onboarding({
  onSave,
  onTour,
  startAtQuestions = false,
}: {
  onSave: (p: Profile) => void;
  onTour: () => void;
  startAtQuestions?: boolean;
}) {
  const today = todayISO();
  const earliest = addDays(today, -MAX_DAYS_BACK);

  const [step, setStep] = useState(startAtQuestions ? 0 : -1); // -1 = welcome
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [routine, setRoutine] = useState<Routine>({ am: [...DEFAULT_ROUTINE.am], pm: [...DEFAULT_ROUTINE.pm] });
  const [error, setError] = useState('');

  const go = (to: number) => {
    setError('');
    setStep(to);
    window.scrollTo(0, 0);
  };

  if (step === -1) return <Welcome onStart={() => go(0)} onTour={onTour} />;

  const next = () => {
    if (step === 0 && !skinType) return setError('Pick the one that sounds most like you.');
    if (step === 1) {
      if (!lastPeriod) return setError('Pick the day your last period started — a best guess is fine.');
      if (lastPeriod > today) return setError('That date is in the future — pick the day it last started.');
      if (lastPeriod < earliest)
        return setError(
          // The GP line is SEE_SOMEONE's HSE-sourced wording, not a new claim.
          'Pick a date in the last three months. If it’s been longer, the week-by-week guidance won’t fit — and three missed periods in a row when you’re not pregnant is a reason to see a GP.',
        );
    }
    if (step < STEPS.length - 1) return go(step + 1);
    onSave({ periodStarts: [lastPeriod], cycleLength, periodLength, skinType: skinType!, routine });
  };

  const last = step === STEPS.length - 1;

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-6 sm:py-12">
      <div className="w-full max-w-md flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="min-h-11 -ml-2 pl-1 pr-3 flex items-center gap-0.5 text-sm text-muted hover:text-ink transition"
          >
            <ChevronIcon direction="left" /> Back
          </button>
          <span className="text-xs text-muted tabular-nums">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-8" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={`h-1.5 rounded-full transition-colors ${i <= step ? STEP_COLOURS[i] : 'bg-line'}`} />
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
          {step === 0 && (
            <section aria-labelledby="step-title">
              <h1 id="step-title" className="font-display text-3xl leading-tight mb-2">
                What’s your skin like, most days?
              </h1>
              <p className="text-muted leading-relaxed mb-6">So the tips suit your skin.</p>
              <SkinTypePicker
                value={skinType}
                hideLegend
                legend="Your skin, most days"
                onChange={(t) => {
                  setSkinType(t);
                  setError('');
                }}
              />
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="step-title" className="space-y-6">
              <div>
                <h1 id="step-title" className="font-display text-3xl leading-tight mb-2">
                  Your cycle
                </h1>
                <p className="text-muted leading-relaxed">
                  A best guess is fine — you can change it later.
                </p>
              </div>

              <div>
                <label htmlFor="lastPeriod" className={FIELD_LABEL}>
                  When did your last period start?
                </label>
                <input
                  id="lastPeriod"
                  type="date"
                  min={earliest}
                  max={today}
                  value={lastPeriod}
                  onChange={(e) => {
                    setLastPeriod(e.target.value);
                    setError('');
                  }}
                  className="w-full min-h-13 px-3.5 rounded-2xl border border-line bg-surface text-[16px] focus:outline-2 focus:outline-accent"
                />
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
              <p className="text-xs text-muted -mt-3">Not sure? 28 and 5 are fine to start with.</p>

              <p className="text-sm leading-relaxed rounded-2xl bg-luteal-soft text-luteal-ink p-4">{PILL_NOTE.text}</p>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-title">
              <h1 id="step-title" className="font-display text-3xl leading-tight mb-2">
                Your routine
              </h1>
              <p className="text-muted leading-relaxed mb-6">
                Keep the steps you do, add your own, and change them any time.
              </p>
              <RoutineEditor routine={routine} onChange={setRoutine} />
            </section>
          )}

          {error && (
            <p role="alert" className="text-sm text-menstrual-ink mt-5">
              {error}
            </p>
          )}

          <div className="mt-auto pt-8">
            <button type="submit" className={primary}>
              {last ? 'Start my skin diary' : 'Continue'}
            </button>
            {last && (
              <p className="text-xs text-muted text-center mt-3">
                We’ll add some sample entries so the diary isn’t empty. One tap removes them.
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
