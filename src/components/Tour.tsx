import { PHASE_META, type Phase } from '../lib/cycle';
import { XIcon } from './Icons';

export type TourTarget = 'skin-today' | 'routine' | 'guide' | 'pattern';

export interface TourStep {
  tab: 'today' | 'guide' | 'diary';
  target: TourTarget;
  title: string;
  body: string;
}

/**
 * Five stops: who the sample person is, then one idea per stop. Maya is made up; the guidance on
 * screen is the real thing.
 */
export const TOUR: TourStep[] = [
  {
    tab: 'today',
    target: 'skin-today',
    title: 'Meet Maya',
    body: 'A sample diary. Maya added her details once — here’s what the app does with them.',
  },
  {
    tab: 'today',
    target: 'skin-today',
    title: 'Tips for this week',
    body: 'How skin tends to change at this point in the cycle, with tips for combination skin.',
  },
  {
    tab: 'today',
    target: 'routine',
    title: 'A two-tap diary',
    body: 'Watch — ticking today’s routine and rating the skin.',
  },
  {
    tab: 'guide',
    target: 'guide',
    title: 'Advice you can check',
    body: 'Every home remedy shows how strong the evidence is and a caution. Tap through to the sources.',
  },
  {
    tab: 'diary',
    target: 'pattern',
    title: 'A pattern over time',
    body: 'Ratings build into a picture of each phase. A pattern shows once there are enough ratings.',
  },
];

export interface TourPerson {
  name: string;
  age: number | null;
  skinType: string;
  day: number;
  cycleLength: number;
  phase: Phase;
}

/** The first stop's card: the sample person's details, as they'd be entered at setup. */
function PersonCard({ person }: { person: TourPerson }) {
  const meta = PHASE_META[person.phase];
  const facts = [
    person.age !== null ? `Age ${person.age}` : null,
    `${person.skinType} skin`,
    `Day ${person.day} of ${person.cycleLength}`,
  ].filter(Boolean) as string[];
  return (
    <div className="flex items-center gap-4 mt-4 p-3 rounded-2xl bg-white/8 border border-white/10">
      <span className="relative w-14 h-14 shrink-0 anim-pop">
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(var(--color-menstrual),var(--color-follicular),var(--color-ovulatory),var(--color-luteal),var(--color-menstrual))] anim-spin-in" />
        <span className="absolute inset-[3px] rounded-full bg-ink flex items-center justify-center font-display text-2xl">
          {person.name[0]}
        </span>
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{person.name}</p>
        <ul className="flex flex-wrap gap-1.5 mt-1 anim-stagger">
          {facts.map((f) => (
            <li key={f} className="text-xs px-2.5 py-1 rounded-full bg-white/12">
              {f}
            </li>
          ))}
          <li className={`text-xs px-2.5 py-1 rounded-full ${meta.soft} ${meta.ink} font-semibold`}>{person.phase}</li>
        </ul>
      </div>
    </div>
  );
}

/** The tour card: pinned to the bottom of the screen so the app stays visible above it. */
export function Tour({
  step,
  person,
  onStep,
  onExit,
  onStartOwn,
}: {
  step: number;
  person: TourPerson;
  onStep: (n: number) => void;
  onExit: () => void;
  onStartOwn: () => void;
}) {
  const s = TOUR[step];
  const last = step === TOUR.length - 1;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:pb-6 pointer-events-none">
      <section
        aria-live="polite"
        aria-label="Guided demo"
        className="pointer-events-auto max-w-xl mx-auto bg-ink text-white rounded-3xl p-5 shadow-[0_20px_50px_-12px_rgba(45,35,49,0.55)] animate-[tour-in_320ms_var(--ease-out)]"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${TOUR.length}`} role="img">
            {TOUR.map((t, i) => (
              <span
                key={t.title}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-7 bg-white' : i < step ? 'w-1.5 bg-white/70' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onExit}
            aria-label="Close the demo"
            className="w-11 h-11 -mr-3 -mt-3 rounded-full flex items-center justify-center text-white/70 hover:text-white"
          >
            <XIcon />
          </button>
        </div>

        <div key={step} className="anim-slide-in">
          <h2 className="font-display text-xl mb-1">{s.title}</h2>
          <p className="text-sm leading-relaxed text-white/80">{s.body}</p>
          {step === 0 && <PersonCard person={person} />}
        </div>

        <div className="flex items-center gap-2 mt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => onStep(step - 1)}
              className="min-h-11 px-4 rounded-2xl text-sm text-white/80 hover:text-white"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={last ? onStartOwn : () => onStep(step + 1)}
            className="ml-auto min-h-11 px-5 rounded-2xl bg-white text-ink text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition"
          >
            {last ? 'Start my own diary' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  );
}
