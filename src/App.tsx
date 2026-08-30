import { useEffect, useMemo, useState } from 'react';
import { getAdvice, type ClimateId } from './lib/advice';
import { getCycleDay, getPhase } from './lib/cycle';
import type { Product } from './lib/products';
import {
  loadProducts,
  loadProfile,
  sampleProducts,
  saveProducts,
  saveProfile,
  type Profile,
} from './lib/storage';
import { AdviceCard } from './components/AdviceCard';
import { ClimatePicker } from './components/ClimatePicker';
import { PhaseStrip } from './components/PhaseStrip';
import { ProductShelf } from './components/ProductShelf';
import { Setup } from './components/Setup';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setProducts(loadProducts());
    setReady(true);
  }, []);

  const cycleDay = useMemo(
    () => getCycleDay(profile?.cycleStartDate, profile?.cycleLength ?? 28),
    [profile],
  );
  const phase = getPhase(cycleDay);
  const advice = useMemo(
    () => (profile ? getAdvice(phase, profile.skinType, profile.climate) : null),
    [profile, phase],
  );

  if (!ready) return null;

  if (!profile) {
    return (
      <Setup
        onDone={(p) => {
          saveProfile(p);
          setProfile(p);
          const seeded = sampleProducts();
          saveProducts(seeded);
          setProducts(seeded);
        }}
      />
    );
  }

  const setClimate = (climate: ClimateId) => {
    const next = { ...profile, climate };
    saveProfile(next);
    setProfile(next);
  };

  const updateProducts = (next: Product[]) => {
    saveProducts(next);
    setProducts(next);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-5 sm:p-8">
        <header className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl">Skincare</h1>
            <p className="text-sm text-muted mt-0.5">
              {profile.skinType} skin · adapts to your cycle and the weather
            </p>
          </div>
          <button
            type="button"
            onClick={() => setProfile(null)}
            className="text-sm text-muted hover:text-ink transition"
          >
            Settings
          </button>
        </header>

        <div className="space-y-4">
          {profile.cycleStartDate && <PhaseStrip day={cycleDay} phase={phase} />}
          <ClimatePicker value={profile.climate} onChange={setClimate} />
          {advice && <AdviceCard advice={advice} />}
          <ProductShelf products={products} onChange={updateProducts} />
        </div>

        <footer className="text-xs text-muted text-center mt-8 leading-relaxed">
          Everything stays in this browser. Nothing is sent anywhere.
        </footer>
      </div>
    </div>
  );
}
