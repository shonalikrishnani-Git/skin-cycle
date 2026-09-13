import { PHASE_META, type CycleInfo } from '../lib/cycle';
import { PHASE_GUIDE, SKIN_TYPE_TIP, type SkinType } from '../lib/skin';

function Tile({ label, value, labelClass }: { label: string; value: string; labelClass: string }) {
  return (
    <div className="rounded-2xl bg-canvas border border-line p-3 flex flex-col gap-1 min-w-0">
      <span className={`text-[10px] uppercase tracking-wider ${labelClass}`}>{label}</span>
      <span className="text-[13px] font-semibold leading-snug">{value}</span>
    </div>
  );
}

/**
 * The first thing on screen, and the point of the app: what your skin needs today.
 * The cycle only appears as the small chip that explains why.
 */
export function SkinToday({
  info,
  skinType,
  onOpenGuide,
}: {
  info: CycleInfo;
  skinType: SkinType;
  onOpenGuide: () => void;
}) {
  const guide = PHASE_GUIDE[info.phase];
  const meta = PHASE_META[info.phase];
  // A different home-care idea each day, cycling through this phase's list.
  const remedy = guide.homeCare[(info.day - 1) % guide.homeCare.length];

  return (
    <section aria-label="Your skin today" className="bg-surface border border-line rounded-3xl p-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs uppercase tracking-widest text-muted">Your skin today</p>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${meta.soft} ${meta.ink}`}>
          Day {info.day} · {info.phase}
        </span>
      </div>

      <h2 className="font-display text-[26px] leading-tight text-balance">{guide.headline}</h2>
      <p className="text-sm text-muted leading-relaxed mt-2 text-pretty">{guide.tendency}</p>

      <div className="grid grid-cols-3 gap-2 mt-5">
        <Tile label="Hydrate" value={guide.hydrate[0].short} labelClass="text-follicular-ink" />
        <Tile label="Moisturise" value={guide.moisturise[0].short} labelClass="text-luteal-ink" />
        <Tile label="Go easy on" value={guide.goEasyOn[0].short} labelClass="text-menstrual-ink" />
      </div>

      <p className="text-xs text-muted leading-relaxed mt-3">
        <span className="font-semibold text-ink">{skinType} skin:</span> {SKIN_TYPE_TIP[skinType]}
      </p>

      <div className={`mt-5 rounded-2xl p-4 ${meta.soft}`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className={`text-xs uppercase tracking-widest ${meta.ink}`}>Home care idea</p>
          <span className="text-[10px] text-ink/60 text-right">{remedy.evidence}</span>
        </div>
        <p className="text-sm font-semibold">{remedy.name}</p>
        <p className="text-sm text-ink/75 leading-relaxed mt-1">{remedy.how}</p>
        {/* Every remedy shows its caution wherever it appears — not only in the full guide. */}
        <p className="text-xs text-menstrual-ink leading-relaxed mt-2">{remedy.caution}</p>
      </div>

      <button
        type="button"
        onClick={onOpenGuide}
        className="w-full min-h-12 mt-4 rounded-2xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition"
      >
        See this week’s full skin guide
      </button>
    </section>
  );
}
