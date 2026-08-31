import { useEffect, useMemo, useState } from 'react';
import { getAdvice, type ClimateId } from './lib/advice';
import { getCycleDay, getPhase } from './lib/cycle';
import {
  emptyLog,
  historyIsSample,
  loadLogs,
  markSampleCleared,
  sampleHistory,
  saveLogs,
  summariseByPhase,
  todayISO,
  upsertLog,
  type DayLog,
} from './lib/log';
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
import { DailyCheckIn } from './components/DailyCheckIn';
import { Learn } from './components/Learn';
import { LookBack } from './components/LookBack';
import { PhaseStrip } from './components/PhaseStrip';
import { ProductShelf } from './components/ProductShelf';
import { Setup } from './components/Setup';

type Tab = 'today' | 'pattern' | 'learn';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [isSample, setIsSample] = useState(false);
  const [tab, setTab] = useState<Tab>('today');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setProducts(loadProducts());
    setLogs(loadLogs());
    setIsSample(historyIsSample());
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

  const todayLog = useMemo(
    () => logs.find((l) => l.date === todayISO()) ?? emptyLog(),
    [logs],
  );

  const summaries = useMemo(
    () => summariseByPhase(logs, profile?.cycleStartDate, profile?.cycleLength ?? 28),
    [logs, profile],
  );

  if (!ready) return null;

  if (!profile) {
    return (
      <Setup
        onDone={(p) => {
          saveProfile(p);
          setProfile(p);

          const seededProducts = sampleProducts();
          saveProducts(seededProducts);
          setProducts(seededProducts);

          // Only invent history when there's a cycle to hang it on.
          if (p.cycleStartDate) {
            const seededLogs = sampleHistory(p.cycleStartDate, p.cycleLength);
            saveLogs(seededLogs);
            setLogs(seededLogs);
            setIsSample(true);
          }
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

  const updateLog = (entry: DayLog) => {
    const next = upsertLog(logs, entry);
    saveLogs(next);
    setLogs(next);
  };

  const clearSample = () => {
    const mine = logs.filter((l) => l.date === todayISO());
    saveLogs(mine);
    setLogs(mine);
    markSampleCleared();
    setIsSample(false);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'pattern', label: 'Pattern' },
    { id: 'learn', label: 'Learn' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-5 sm:p-8">
        <header className="flex items-baseline justify-between mb-5">
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

        <nav aria-label="Sections" className="flex gap-1 mb-5 p-1 bg-surface border border-line rounded-2xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-xl text-sm transition ${
                tab === t.id ? 'bg-accent text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'today' && (
          <div className="space-y-4">
            {profile.cycleStartDate && <PhaseStrip day={cycleDay} phase={phase} />}
            <ClimatePicker value={profile.climate} onChange={setClimate} />
            {advice && <AdviceCard advice={advice} />}
            <DailyCheckIn log={todayLog} onChange={updateLog} />
            <ProductShelf products={products} onChange={updateProducts} />
          </div>
        )}

        {tab === 'pattern' && (
          <div className="space-y-4">
            <LookBack summaries={summaries} isSample={isSample} onClearSample={clearSample} />
          </div>
        )}

        {tab === 'learn' && <Learn />}

        <footer className="text-xs text-muted text-center mt-8 leading-relaxed">
          Everything stays in this browser. Nothing is sent anywhere.
        </footer>
      </div>
    </div>
  );
}
