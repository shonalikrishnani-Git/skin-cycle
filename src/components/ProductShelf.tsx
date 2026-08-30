import { useState } from 'react';
import { CATEGORIES, DEFAULT_LIFESPAN, getDepletion, type Product } from '../lib/products';
import { newId } from '../lib/storage';

const STATUS_STYLE = {
  fresh: { bar: 'bg-accent', chip: 'text-accent bg-accent-soft', label: 'In stock' },
  low: { bar: 'bg-warn', chip: 'text-warn bg-warn-soft', label: 'Running low' },
  empty: { bar: 'bg-alert', chip: 'text-alert bg-alert-soft', label: 'Likely empty' },
} as const;

function ProductRow({ product, onRemove }: { product: Product; onRemove: (id: string) => void }) {
  const { percentUsed, daysLeft, status } = getDepletion(product);
  const style = STATUS_STYLE[status];

  return (
    <li className="py-4 border-b border-line last:border-0">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-xs text-muted">{product.category}</p>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${style.chip}`}>
          {style.label}
        </span>
      </div>

      <div
        className="h-1.5 bg-line rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentUsed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${product.name} used`}
      >
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${percentUsed}%` }} />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted">
          {daysLeft > 0 ? `About ${daysLeft} days left` : `Ran out around ${Math.abs(daysLeft)} days ago`}
        </p>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="text-xs text-muted hover:text-alert transition"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export function ProductShelf({
  products,
  onChange,
}: {
  products: Product[];
  onChange: (p: Product[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const remove = (id: string) => onChange(products.filter((p) => p.id !== id));

  const target = products.find((p) => p.id === confirming);

  return (
    <section aria-label="Your shelf" className="bg-surface border border-line rounded-3xl p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-2xl">Your shelf</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="text-sm text-accent hover:opacity-70 transition"
        >
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>
      <p className="text-sm text-muted mb-4">When things run out, before they run out.</p>

      {adding && (
        <form
          className="bg-canvas border border-line rounded-2xl p-4 mb-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const category = String(form.get('category'));
            const name = String(form.get('name')).trim();
            if (!name) return;
            onChange([
              ...products,
              {
                id: newId(),
                name,
                category,
                purchaseDate: String(form.get('purchaseDate')),
                lifespanDays: Number(form.get('lifespanDays')) || DEFAULT_LIFESPAN[category] || 60,
              },
            ]);
            setAdding(false);
          }}
        >
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted mb-1.5">
              Product
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Vitamin C serum"
              className="w-full p-2.5 rounded-lg border border-line bg-surface text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="block text-xs uppercase tracking-widest text-muted mb-1.5">
                Type
              </label>
              <select id="category" name="category" className="w-full p-2.5 rounded-lg border border-line bg-surface text-sm">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lifespanDays" className="block text-xs uppercase tracking-widest text-muted mb-1.5">
                Lasts (days)
              </label>
              <input
                id="lifespanDays"
                name="lifespanDays"
                type="number"
                min={1}
                defaultValue={60}
                className="w-full p-2.5 rounded-lg border border-line bg-surface text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-xs uppercase tracking-widest text-muted mb-1.5">
              Bought on
            </label>
            <input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full p-2.5 rounded-lg border border-line bg-surface text-sm"
            />
          </div>

          <button type="submit" className="w-full p-2.5 rounded-lg bg-accent text-white text-sm font-medium">
            Add to shelf
          </button>
        </form>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-muted py-6 text-center">
          Nothing on the shelf yet. Add what you're using.
        </p>
      ) : (
        <ul>
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onRemove={setConfirming} />
          ))}
        </ul>
      )}

      {target && (
        <div className="mt-4 p-4 rounded-2xl bg-alert-soft border border-alert/20">
          <p className="text-sm mb-3">
            Remove <strong>{target.name}</strong> from your shelf?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                remove(target.id);
                setConfirming(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-alert text-white text-sm"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className="px-3 py-1.5 rounded-lg border border-line text-sm"
            >
              Keep it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
