import { DISCLAIMER, type Advice, type Source, type Tip } from '../lib/advice';

const SOURCE_LABEL: Record<Source, string> = {
  cycle: 'cycle',
  skin: 'your skin',
  climate: 'weather',
};

/**
 * Each tip shows WHY, and where it came from. The tag matters: it's how you learn that a
 * suggestion came from the weather rather than your cycle, instead of trusting a black box.
 */
function TipRow({ tip }: { tip: Tip }) {
  return (
    <li className="py-3 border-b border-line last:border-0">
      <div className="flex items-start gap-2.5">
        <span className="text-[10px] uppercase tracking-wider text-muted border border-line rounded-full px-2 py-0.5 mt-0.5 shrink-0">
          {SOURCE_LABEL[tip.source]}
        </span>
        <div>
          <p className="text-sm font-medium leading-snug">{tip.text}</p>
          <p className="text-sm text-muted leading-relaxed mt-1">{tip.why}</p>
        </div>
      </div>
    </li>
  );
}

export function AdviceCard({ advice }: { advice: Advice }) {
  return (
    <section aria-label="Today's guidance" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-2">Today</h2>
      <p className="text-muted leading-relaxed mb-6">{advice.summary}</p>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-accent mb-1">Focus on</h3>
          <ul>
            {advice.focus.map((t, i) => (
              <TipRow key={`f${i}`} tip={t} />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-alert mb-1">Skip for now</h3>
          <ul>
            {advice.skip.map((t, i) => (
              <TipRow key={`s${i}`} tip={t} />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted mb-1">Hair</h3>
          <ul>
            {advice.hair.map((t, i) => (
              <TipRow key={`h${i}`} tip={t} />
            ))}
          </ul>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed mt-6 pt-4 border-t border-line">{DISCLAIMER}</p>
    </section>
  );
}
