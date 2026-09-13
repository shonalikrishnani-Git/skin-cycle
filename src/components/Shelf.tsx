import { useState } from 'react';
import { todayISO } from '../lib/cycle';
import { ACTIVES, PRODUCT_STEPS, activeLabel, type ActiveId, type ProductStep, type ShelfProduct } from '../lib/shelf';

const FIELD = 'w-full min-h-12 px-3 rounded-2xl border border-line bg-canvas focus:outline-2 focus:outline-accent';
const LABEL = 'block text-xs uppercase tracking-widest text-muted mb-2';

/**
 * The products you actually own. This tab is just the list and the form to keep it current —
 * turning it into timing tips is FromYourShelf's job, on the Today tab.
 */
export function Shelf({
  products,
  onAdd,
  onRemove,
}: {
  products: ShelfProduct[];
  onAdd: (product: ShelfProduct) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<ProductStep>('Moisturiser');
  const [active, setActive] = useState<ActiveId>('none');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: crypto.randomUUID(), name: trimmed.slice(0, 60), step, active, addedOn: todayISO() });
    setName('');
    setStep('Moisturiser');
    setActive('none');
  };

  return (
    <div className="space-y-4">
      <section aria-label="Add a product" className="bg-surface border border-line rounded-3xl p-6">
        <h2 className="font-display text-2xl mb-4">Your shelf</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="productName" className={LABEL}>
              Product name
            </label>
            <input
              id="productName"
              type="text"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. a ceramide moisturiser"
              className={FIELD}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="productStep" className={LABEL}>
                Step
              </label>
              <select id="productStep" value={step} onChange={(e) => setStep(e.target.value as ProductStep)} className={FIELD}>
                {PRODUCT_STEPS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productActive" className={LABEL}>
                Main active
              </label>
              <select id="productActive" value={active} onChange={(e) => setActive(e.target.value as ActiveId)} className={FIELD}>
                {ACTIVES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full min-h-12 rounded-2xl bg-accent text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Add to shelf
          </button>
        </form>
      </section>

      {products.length === 0 ? (
        <section aria-label="Empty shelf" className="bg-surface border border-line rounded-3xl p-6 text-center">
          <p className="text-sm text-muted leading-relaxed">
            Add what’s actually in your bathroom cabinet, and Today will tell you when to lean into it, keep it steady, or
            ease off — timed to your cycle.
          </p>
        </section>
      ) : (
        PRODUCT_STEPS.map((s) => {
          const inStep = products.filter((p) => p.step === s);
          if (inStep.length === 0) return null;
          return (
            <section key={s} aria-label={s} className="bg-surface border border-line rounded-3xl p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted mb-3">{s}</h3>
              <ul className="flex flex-col gap-3">
                {inStep.map((p) => (
                  <li key={p.id} className="rounded-2xl bg-canvas border border-line p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug">{p.name}</p>
                        <p className="text-xs text-muted mt-0.5">{activeLabel(p.active)}</p>
                      </div>
                      {confirmId !== p.id && (
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          className="min-h-11 px-3 -mr-1 -mt-1 text-xs text-muted hover:text-menstrual-ink transition shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {confirmId === p.id && (
                      <div className="mt-3 pt-3 border-t border-line">
                        <p className="text-sm mb-2">Remove {p.name}?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onRemove(p.id);
                              setConfirmId(null);
                            }}
                            className="px-4 min-h-11 rounded-xl bg-menstrual-ink text-white text-sm"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="px-4 min-h-11 rounded-xl border border-line bg-surface text-sm"
                          >
                            Keep it
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
