import { useState } from 'react';
import {
  BEGINNER_STEPS,
  DALTON_RULE,
  INGREDIENTS,
  LAYER_COUNT_NOTE,
  MYTHS,
  SKIN_LAYERS,
  SOURCES,
  TURNOVER_NOTE,
  type Depth,
} from '../lib/science';
import { SkinCrossSection } from './SkinCrossSection';

const DEPTH_STYLE: Record<Depth, { label: string; cls: string }> = {
  'through-barrier': { label: 'Gets through', cls: 'text-accent bg-accent-soft' },
  surface: { label: 'Works on top', cls: 'text-warn bg-warn-soft' },
  blocked: { label: "Can't get in", cls: 'text-alert bg-alert-soft' },
};

function Card({ children }: { children: React.ReactNode }) {
  return <section className="bg-surface border border-line rounded-3xl p-6">{children}</section>;
}

export function Learn() {
  const [layer, setLayer] = useState('corneum');
  const active = SKIN_LAYERS.find((l) => l.id === layer)!;

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-display text-2xl mb-1">What you're putting it on</h2>
        <p className="text-sm text-muted mb-5">
          Before what to use — where it actually lands.
        </p>

        <SkinCrossSection selected={layer} onSelect={setLayer} />

        <div className="mt-4 p-4 rounded-2xl bg-canvas border border-line">
          <h3 className="text-sm font-medium mb-1">
            {active.name} <span className="text-muted font-normal">· {active.plain}</span>
          </h3>
          <p className="text-sm text-muted leading-relaxed">{active.detail}</p>
        </div>

        <p className="text-xs text-muted leading-relaxed mt-4">{LAYER_COUNT_NOTE}</p>
        <p className="text-xs text-muted leading-relaxed mt-3">{TURNOVER_NOTE}</p>
      </Card>

      <Card>
        <h2 className="font-display text-2xl mb-1">How deep does it get?</h2>
        <p className="text-sm text-muted mb-4">{DALTON_RULE}</p>

        <ul>
          {INGREDIENTS.map((ing) => {
            const style = DEPTH_STYLE[ing.depth];
            return (
              <li key={ing.name} className="py-3.5 border-b border-line last:border-0">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <div className="min-w-0">
                    <span className="text-sm font-medium">{ing.name}</span>
                    <span className="text-xs text-muted ml-2">{ing.weight}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${style.cls}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{ing.note}</p>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-2xl mb-4">Four things that aren't true</h2>
        <ul className="space-y-5">
          {MYTHS.map((m) => (
            <li key={m.claim}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-alert-soft text-alert shrink-0">
                  {m.verdict}
                </span>
                <p className="text-sm font-medium leading-snug">“{m.claim}”</p>
              </div>
              <p className="text-sm text-muted leading-relaxed">{m.because}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-2xl mb-1">If you're starting from nothing</h2>
        <p className="text-sm text-muted mb-4">The whole beginner routine, in four steps.</p>
        <ol className="space-y-4">
          {BEGINNER_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent-soft text-accent text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-sm text-muted leading-relaxed mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Where this comes from</h2>
        <ul className="space-y-2">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent underline underline-offset-2 hover:opacity-70"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted leading-relaxed mt-4">
          Educational content, not medical advice. Skin that is painful, persistent or changing
          deserves a pharmacist or GP.
        </p>
      </Card>
    </div>
  );
}
