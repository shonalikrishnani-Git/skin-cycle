import { XIcon } from './Icons';

export type TourTarget = 'skin-today' | 'routine' | 'guide' | 'pattern';

export interface TourStep {
  tab: 'today' | 'guide' | 'diary';
  target: TourTarget;
  title: string;
  body: string;
}

/**
 * Four stops, one per idea. The sample person is made up; the guidance on screen is the real thing.
 * The last stop says plainly that the sample skin has no cycle pattern — on purpose.
 */
export const TOUR: TourStep[] = [
  {
    tab: 'today',
    target: 'skin-today',
    title: 'Your skin this week',
    body: 'A sample diary: combination skin, day 22 of the cycle. Today shows what skin tends to need this week.',
  },
  {
    tab: 'today',
    target: 'routine',
    title: 'A two-tap diary',
    body: 'Tick your steps and pick a face. Watch — we’re filling in today.',
  },
  {
    tab: 'guide',
    target: 'guide',
    title: 'Advice you can check',
    body: 'Every tip has an evidence level, a caution and a source.',
  },
  {
    tab: 'diary',
    target: 'pattern',
    title: 'Your own pattern',
    body: 'After a few weeks of ratings, see how your skin feels in each phase. The app only shows a pattern your own ratings support.',
  },
];

/** The tour card: pinned to the bottom of the screen so the app stays visible above it. */
export function Tour({
  step,
  onStep,
  onExit,
  onStartOwn,
}: {
  step: number;
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
        aria-label="Guided tour"
        className="pointer-events-auto max-w-xl mx-auto bg-ink text-white rounded-3xl p-5 shadow-[0_20px_50px_-12px_rgba(45,35,49,0.55)] animate-[tour-in_280ms_ease-out]"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${TOUR.length}`} role="img">
            {TOUR.map((t, i) => (
              <span key={t.title} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-white' : 'w-1.5 bg-white/35'}`} />
            ))}
          </div>
          <button
            type="button"
            onClick={onExit}
            aria-label="Close the tour"
            className="w-11 h-11 -mr-3 -mt-3 rounded-full flex items-center justify-center text-white/70 hover:text-white"
          >
            <XIcon />
          </button>
        </div>
        <h2 className="font-display text-xl mb-1.5">{s.title}</h2>
        <p className="text-sm leading-relaxed text-white/85">{s.body}</p>

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
          {last ? (
            <button
              type="button"
              onClick={onStartOwn}
              className="ml-auto min-h-11 px-5 rounded-2xl bg-white text-ink text-sm font-semibold hover:bg-white/90"
            >
              Start my own diary
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStep(step + 1)}
              className="ml-auto min-h-11 px-5 rounded-2xl bg-white text-ink text-sm font-semibold hover:bg-white/90"
            >
              Next
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
