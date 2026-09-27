import { useState } from 'react';
import { PHASES, PHASE_META, type Phase } from '../lib/cycle';
import {
  BREASTFEEDING_NOTE,
  DONT_TRY,
  EVIDENCE_NOTE,
  MYTHS,
  PHASE_GUIDE,
  PILL_NOTE,
  PREGNANCY_NOTE,
  SEE_SOMEONE,
  SKIN_TYPE_TIP,
  SOURCES,
  type Pick,
  type SkinType,
} from '../lib/skin';
import { CARD, EVIDENCE_STYLE } from './guideStyles';
import { ChevronIcon } from './Icons';
import { Sources } from './Sources';

function PickList({ title, picks, titleClass }: { title: string; picks: Pick[]; titleClass: string }) {
  return (
    <div>
      <h3 className={`text-xs uppercase tracking-widest mb-2 ${titleClass}`}>{title}</h3>
      <ul className="flex flex-col gap-3">
        {picks.map((p) => (
          <li key={p.name}>
            <p className="text-sm font-semibold leading-snug">{p.name}</p>
            <p className="text-sm text-muted leading-relaxed mt-0.5">{p.why}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A card that opens and closes, so the guide reads as a list of topics rather than one long page. */
function Fold({ title, count, open, children }: { title: string; count?: number; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className={`${CARD} group !py-1`}>
      <summary className="flex items-center justify-between gap-3 min-h-14 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h2 className="font-display text-xl">
          {title}
          {count !== undefined && <span className="ml-2 text-sm font-sans text-muted">{count}</span>}
        </h2>
        <ChevronIcon direction="down" className="text-muted shrink-0 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="anim-fade-up pb-5 pt-1">{children}</div>
    </details>
  );
}

/** The full guide for any phase: routine, home care, what not to try, and when to see someone. */
export function Guide({
  currentPhase,
  skinType,
  selected,
  onSelect,
}: {
  currentPhase: Phase;
  skinType: SkinType;
  selected: Phase;
  onSelect: (phase: Phase) => void;
}) {
  const guide = PHASE_GUIDE[selected];
  const meta = PHASE_META[selected];
  const [showSources, setShowSources] = useState(false);

  if (showSources) {
    return <Sources onBack={() => setShowSources(false)} />;
  }

  return (
    <div className="space-y-4">
      <nav aria-label="Choose a phase" className="grid grid-cols-4 gap-1 p-1 bg-surface border border-line rounded-2xl">
        {PHASES.map((p) => {
          const on = p === selected;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(p)}
              className={`min-h-12 rounded-xl flex flex-col items-center justify-center text-[12px] leading-tight transition ${
                on ? `${PHASE_META[p].soft} ${PHASE_META[p].ink} font-semibold` : 'text-muted hover:text-ink'
              }`}
            >
              {p}
              {p === currentPhase && <span className="text-xs font-normal opacity-80">this week</span>}
            </button>
          );
        })}
      </nav>

      <section aria-label={`${selected} phase`} className={CARD}>
        <p className={`text-xs uppercase tracking-widest mb-1.5 ${meta.ink}`}>
          {selected === currentPhase ? 'This week' : `${selected} phase`}
        </p>
        <h2 className="font-display text-[26px] leading-tight text-balance">{guide.headline}</h2>
        <p className="text-sm text-muted leading-relaxed mt-2 text-pretty">{guide.tendency.text}</p>
        <p className="text-sm leading-relaxed mt-4 pt-4 border-t border-line">
          <span className="font-semibold">{skinType}:</span> <span className="text-muted">{SKIN_TYPE_TIP[skinType]}</span>
        </p>
      </section>

      <Fold title="Your routine" open>
        <div className="flex flex-col gap-5">
          <PickList title="Hydrate" picks={guide.hydrate} titleClass="text-follicular-ink" />
          <PickList title="Moisturise" picks={guide.moisturise} titleClass="text-luteal-ink" />
          <PickList title="Go easy on" picks={guide.goEasyOn} titleClass="text-menstrual-ink" />
          <PickList title="Keep doing" picks={guide.keepDoing} titleClass="text-muted" />
        </div>
      </Fold>

      <Fold title="Try at home" count={guide.homeCare.length} open>
        <ul className="flex flex-col gap-3">
          {guide.homeCare.map((r) => (
            <li key={r.name} className="rounded-2xl bg-canvas border border-line p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <p className="text-sm font-semibold leading-snug">{r.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${EVIDENCE_STYLE[r.evidence]}`}>
                  {r.evidence}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{r.how}</p>
              <p className="text-sm text-muted leading-relaxed mt-1.5">{r.why}</p>
              <p className="text-xs text-menstrual-ink leading-relaxed mt-2">{r.caution}</p>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="Don’t try this at home" count={DONT_TRY.length}>
        <ul className="flex flex-col gap-3">
          {DONT_TRY.map((w) => (
            <li key={w.name}>
              <p className="text-sm font-semibold">{w.name}</p>
              <p className="text-sm text-muted leading-relaxed mt-0.5">{w.why}</p>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="Myths" count={MYTHS.length}>
        <ul className="flex flex-col gap-4">
          {MYTHS.map((m) => (
            <li key={m.claim}>
              <p className="text-sm font-semibold leading-snug">“{m.claim}”</p>
              <p className="text-sm text-muted leading-relaxed mt-1">{m.truth}</p>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="When to see a pharmacist or GP">
        <ul className="flex flex-col gap-1.5 list-disc pl-5 text-sm text-muted leading-relaxed">
          {SEE_SOMEONE.map((s) => (
            <li key={s.text}>{s.text}</li>
          ))}
        </ul>
      </Fold>

      <Fold title="Pregnancy, breastfeeding and the pill">
        <div className="flex flex-col gap-3 text-sm leading-relaxed">
          <p>{PREGNANCY_NOTE.text}</p>
          <p>{BREASTFEEDING_NOTE.text}</p>
          <p>{PILL_NOTE.text}</p>
        </div>
      </Fold>

      <Fold title="How strong is the evidence?">
        <p className="text-sm text-muted leading-relaxed">{EVIDENCE_NOTE.text}</p>
      </Fold>

      <Fold title="Sources" count={SOURCES.length}>
        <ul className="flex flex-col">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center min-h-11 text-sm text-accent underline underline-offset-2"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Fold>

      <button
        type="button"
        onClick={() => setShowSources(true)}
        className="w-full min-h-11 text-sm text-accent underline underline-offset-2"
      >
        Every claim and its source →
      </button>
    </div>
  );
}
