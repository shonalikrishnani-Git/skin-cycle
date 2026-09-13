import type { Phase } from '../lib/cycle';
import { activeLabel, newProductCaution, timingFor, type ShelfProduct, type Timing } from '../lib/shelf';

const GROUP_LABEL: Record<Timing, string> = {
  lean: 'Lean into',
  steady: 'Keep steady',
  ease: 'Ease off this week',
};

const GROUP_STYLE: Record<Timing, string> = {
  lean: 'text-follicular-ink',
  steady: 'text-muted',
  ease: 'text-menstrual-ink',
};

const TIMINGS: Timing[] = ['lean', 'steady', 'ease'];

/**
 * The payoff for Shelf Sync: your own products, sorted into what to lean into, keep steady, or
 * ease off this week. Sits right after SkinToday — skin first, the shelf is just this week's
 * detail on it.
 */
export function FromYourShelf({
  products,
  phase,
  today,
  onOpenShelf,
}: {
  products: ShelfProduct[];
  phase: Phase;
  today: string;
  onOpenShelf: () => void;
}) {
  if (products.length === 0) {
    return (
      <section aria-label="From your shelf" className="bg-surface border border-line rounded-3xl p-6">
        <h2 className="font-display text-2xl mb-1">From your shelf</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Add what you actually use, and this card will tell you when to lean into it, keep it steady, or ease off —
          timed to your cycle.
        </p>
        <button
          type="button"
          onClick={onOpenShelf}
          className="w-full min-h-12 rounded-2xl bg-accent text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Add to your shelf
        </button>
      </section>
    );
  }

  const groups: Record<Timing, { product: ShelfProduct; why: string; caution: string | null }[]> = {
    lean: [],
    steady: [],
    ease: [],
  };

  for (const product of products) {
    const rule = timingFor(product.active, phase);
    groups[rule.timing].push({ product, why: rule.why, caution: newProductCaution(product, phase, today) });
  }

  return (
    <section aria-label="From your shelf" className="bg-surface border border-line rounded-3xl p-6">
      <h2 className="font-display text-2xl mb-1">From your shelf</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Timing tips, not rules — based on each product’s main active ingredient.
      </p>

      <div className="flex flex-col gap-5">
        {TIMINGS.map((timing) => {
          const rows = groups[timing];
          if (rows.length === 0) return null;
          return (
            <div key={timing}>
              <h3 className={`text-xs uppercase tracking-widest mb-2 ${GROUP_STYLE[timing]}`}>{GROUP_LABEL[timing]}</h3>
              <ul className="flex flex-col gap-3">
                {rows.map(({ product, why, caution }) => (
                  <li key={product.id} className="rounded-2xl bg-canvas border border-line p-4">
                    <p className="text-sm font-semibold leading-snug">{product.name}</p>
                    <p className="text-xs text-muted mt-0.5">{activeLabel(product.active)}</p>
                    <p className="text-sm text-muted leading-relaxed mt-1.5">{why}</p>
                    {caution && <p className="text-xs text-ovulatory-ink leading-relaxed mt-2">{caution}</p>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
