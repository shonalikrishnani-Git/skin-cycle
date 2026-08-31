import { useState } from 'react';
import { ACTIVES, findActives, judge, type Active, type Evidence, type Fit } from '../lib/actives';
import type { SkinType } from '../lib/advice';
import type { Phase } from '../lib/cycle';

const FIT_STYLE: Record<Fit, string> = {
  good: 'text-accent bg-accent-soft border-accent/25',
  caution: 'text-warn bg-warn-soft border-warn/25',
  wait: 'text-warn bg-warn-soft border-warn/25',
};

const EVIDENCE_LABEL: Record<Evidence, string> = {
  strong: 'Strong evidence',
  moderate: 'Moderate evidence',
  limited: 'Limited evidence',
};

const SUGGESTIONS = ['Azelaic acid', 'Retinol', 'Snail mucin', 'Collagen', 'Niacinamide'];

function Result({ active, skinType, phase }: { active: Active; skinType: SkinType; phase: Phase }) {
  const verdict = judge(active, skinType, phase);

  return (
    <article className="border border-line rounded-2xl p-5 bg-canvas">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="font-display text-xl">{active.name}</h3>
        <span className="text-xs text-muted shrink-0">{active.weight}</span>
      </div>

      <p className="text-xs text-muted mb-4">
        {EVIDENCE_LABEL[active.evidence]}
        {active.depth === 'blocked' && ' · too large to get in'}
        {active.depth === 'surface' && ' · works on the surface'}
        {active.depth === 'through-barrier' && ' · small enough to get through'}
      </p>

      <p className="text-sm leading-relaxed mb-4">{active.does}</p>

      {active.overclaim && (
        <div className="border-l-2 border-alert pl-3 mb-4">
          <p className="text-[11px] uppercase tracking-wider text-alert mb-0.5">What it won't do</p>
          <p className="text-sm text-muted leading-relaxed">{active.overclaim}</p>
        </div>
      )}

      <div className={`rounded-xl border p-4 ${FIT_STYLE[verdict.fit]}`}>
        <p className="text-sm font-medium mb-2">{verdict.headline}</p>
        <ul className="space-y-1.5">
          {verdict.reasons.map((r, i) => (
            <li key={i} className="text-sm text-ink/80 leading-relaxed">
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {active.goodFor.map((g) => (
          <span key={g} className="text-[11px] px-2 py-0.5 rounded-full border border-line text-muted">
            {g}
          </span>
        ))}
      </div>
    </article>
  );
}

/**
 * The answer to "I saw this all over my feed — should I get it?"
 *
 * Deliberately not review-based. Retail reviews are the same noise the feed already is; this
 * answers from molecular size, evidence strength, your skin and your phase instead.
 */
export function CheckIt({ skinType, phase }: { skinType: SkinType; phase: Phase }) {
  const [query, setQuery] = useState('');
  const results = findActives(query);
  const searching = query.trim().length >= 2;

  return (
    <section aria-label="Check an ingredient" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">Seen something everywhere?</h2>
      <p className="text-sm text-muted mb-4">
        Type what's in it. You'll get what it actually does, and whether it's right for you this
        week — not a stranger's star rating.
      </p>

      <label htmlFor="check" className="sr-only">
        Ingredient name
      </label>
      <input
        id="check"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="azelaic acid, retinol, snail mucin…"
        className="w-full p-3 rounded-xl border border-line bg-canvas focus:outline-2 focus:outline-accent mb-3"
      />

      {!searching && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-line text-muted hover:border-accent hover:text-accent transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {searching && results.length === 0 && (
        <p className="text-sm text-muted py-4">
          Not one of the {ACTIVES.length} ingredients here yet. Try the active itself rather than
          the brand — "niacinamide" rather than the bottle it came in.
        </p>
      )}

      <div className="space-y-3">
        {results.map((a) => (
          <Result key={a.id} active={a} skinType={skinType} phase={phase} />
        ))}
      </div>
    </section>
  );
}
