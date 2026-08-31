import { useState } from 'react';
import type { SkinType } from '../lib/advice';
import type { Phase } from '../lib/cycle';
import { judge } from '../lib/actives';
import { NO_SCORE_NOTE, ORDER_NOTE, readLabel, type FlagKind } from '../lib/label';

const KIND_STYLE: Record<FlagKind, { label: string; cls: string }> = {
  allergen: { label: 'Common allergen', cls: 'text-warn bg-warn-soft' },
  regulatory: { label: 'Regulated', cls: 'text-accent bg-accent-soft' },
  drying: { label: 'Can be drying', cls: 'text-warn bg-warn-soft' },
  note: { label: 'Note', cls: 'text-muted bg-canvas' },
};

const EXAMPLE =
  'Aqua, Glycerin, Niacinamide, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Retinol, ' +
  'Tocopherol, Parfum, Linalool, Citric Acid, Phenoxyethanol';

export function CheckLabel({ skinType, phase }: { skinType: SkinType; phase: Phase }) {
  const [raw, setRaw] = useState('');
  const reading = raw.trim().length > 3 ? readLabel(raw) : null;

  return (
    <section aria-label="Read an ingredients label" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">Read the back of the bottle</h2>
      <p className="text-sm text-muted mb-4">
        Paste the ingredients list — from the box, or copy it off the shop's website. You'll get
        what's in there that matters <em>to you</em>.
      </p>

      <label htmlFor="label-input" className="sr-only">
        Ingredients list
      </label>
      <textarea
        id="label-input"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        placeholder="Aqua, Glycerin, Niacinamide…"
        className="w-full p-3 rounded-xl border border-line bg-canvas focus:outline-2 focus:outline-accent text-sm resize-y"
      />

      {!reading && (
        <button
          type="button"
          onClick={() => setRaw(EXAMPLE)}
          className="text-xs px-3 py-1.5 mt-2 rounded-full border border-line text-muted hover:border-accent hover:text-accent transition"
        >
          Try it with an example label
        </button>
      )}

      {reading && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-muted">
            {reading.total} ingredients · {reading.actives.length} recognised active
            {reading.actives.length === 1 ? '' : 's'} · {reading.flags.length} worth knowing about
          </p>

          {reading.actives.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted mb-2">What's doing the work</h3>
              <ul className="space-y-2">
                {reading.actives.map(({ active, position }) => {
                  const verdict = judge(active, skinType, phase);
                  return (
                    <li key={active.id} className="border border-line rounded-2xl p-4 bg-canvas">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-sm font-medium">{active.name}</span>
                        <span className="text-[11px] text-muted shrink-0">
                          #{position} on the list
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed mb-2">{active.does}</p>
                      <p className="text-sm font-medium">{verdict.headline}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {reading.flags.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted mb-2">Worth knowing</h3>
              <ul className="space-y-2">
                {reading.flags.map((f) => {
                  const style = KIND_STYLE[f.kind];
                  const forYou = f.mattersMostTo?.includes(skinType);
                  return (
                    <li key={f.title} className="border border-line rounded-2xl p-4 bg-canvas">
                      <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${style.cls}`}>
                          {style.label}
                        </span>
                        <span className="text-sm font-medium">{f.title}</span>
                        {forYou && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-alert-soft text-alert">
                            relevant to {skinType.toLowerCase()} skin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{f.detail}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {reading.flags.length === 0 && reading.actives.length === 0 && (
            <p className="text-sm text-muted">
              Nothing here that this app has anything useful to say about — which, honestly, is
              true of most well-made products.
            </p>
          )}

          <p className="text-xs text-muted leading-relaxed pt-3 border-t border-line">{ORDER_NOTE}</p>
        </div>
      )}

      <div className="mt-5 p-4 rounded-2xl bg-canvas border border-line">
        <h3 className="text-xs uppercase tracking-widest text-muted mb-1.5">
          Why there's no safety score
        </h3>
        <p className="text-xs text-muted leading-relaxed">{NO_SCORE_NOTE}</p>
      </div>
    </section>
  );
}
