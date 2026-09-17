import { useEffect, useMemo, useState } from 'react';
import { cycleInfoFor, nextPeriod, parseISO, todayISO, type Phase } from './lib/cycle';
import {
  adoptSampleEdit,
  emptyLog,
  hasSample,
  sampleHistory,
  summariseByPhase,
  upsertLog,
  withoutSample,
  type DayLog,
} from './lib/log';
import { clearAllData, loadLogs, loadProfile, saveLogs, saveProfile, type Profile } from './lib/storage';
import { Calendar } from './components/Calendar';
import { CheckIn } from './components/CheckIn';
import { CycleCard } from './components/CycleCard';
import { Guide } from './components/Guide';
import { Pattern } from './components/Pattern';
import { Setup } from './components/Setup';
import { SkinToday } from './components/SkinToday';

type Tab = 'today' | 'guide' | 'diary';

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'guide', label: 'Guide' },
  { id: 'diary', label: 'Diary' },
];

const longDate = new Intl.DateTimeFormat('en-IE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [tab, setTab] = useState<Tab>('today');
  const [selected, setSelected] = useState(todayISO);
  /** null = follow the current phase; set when she browses another phase in the guide. */
  const [guidePhase, setGuidePhase] = useState<Phase | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  /** The date whose sample data was JUST replaced by a real entry, so we can explain the switch once. */
  const [justStarted, setJustStarted] = useState<string | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setLogs(loadLogs());
    setReady(true);
  }, []);

  const summaries = useMemo(() => (profile ? summariseByPhase(logs, profile) : []), [logs, profile]);

  if (!ready) return null;

  const today = todayISO();

  if (!profile) {
    return (
      <Setup
        onSave={(p) => {
          const seeded = sampleHistory(p, today);
          saveProfile(p);
          saveLogs(seeded);
          setProfile(p);
          setLogs(seeded);
          setSelected(today);
          setGuidePhase(null);
          setTab('today');
        }}
      />
    );
  }

  if (settingsOpen) {
    return (
      <Setup
        profile={profile}
        onClose={() => setSettingsOpen(false)}
        onSave={(p) => {
          saveProfile(p);
          setProfile(p);
          setSettingsOpen(false);
        }}
        onDeleteAll={() => {
          clearAllData();
          setProfile(null);
          setLogs([]);
          setSettingsOpen(false);
        }}
      />
    );
  }

  const info = cycleInfoFor(today, profile.periodStarts, profile.cycleLength, profile.periodLength, today)!;
  const next = nextPeriod(profile.periodStarts, profile.cycleLength, today);
  const onlyOneStart = profile.periodStarts.length === 1;

  const go = (t: Tab) => {
    setTab(t);
    if (t === 'diary') setSelected(today);
    if (t === 'guide') setGuidePhase(null);
    window.scrollTo(0, 0);
  };

  const updateLog = (entry: DayLog) => {
    const previous = logs.find((l) => l.date === entry.date);
    const wasSample = previous?.sample ?? false;
    const real = previous && wasSample ? adoptSampleEdit(previous, entry) : { ...entry, sample: false };
    const nextLogs = upsertLog(logs, real);
    saveLogs(nextLogs);
    setLogs(nextLogs);
    if (wasSample) setJustStarted(entry.date);
  };

  const togglePeriodStart = (iso: string) => {
    if (iso > today) return;
    const logged = profile.periodStarts.includes(iso);
    // The cycle needs at least one anchor date, so the last one can't be removed.
    if (logged && onlyOneStart) return;
    const periodStarts = logged
      ? profile.periodStarts.filter((d) => d !== iso)
      : [...profile.periodStarts, iso].sort();
    const nextProfile = { ...profile, periodStarts };
    saveProfile(nextProfile);
    setProfile(nextProfile);
  };

  const clearSample = () => {
    const mine = withoutSample(logs);
    saveLogs(mine);
    setLogs(mine);
  };

  const logFor = (iso: string) => logs.find((l) => l.date === iso) ?? emptyLog(iso);
  const selectedInfo = cycleInfoFor(selected, profile.periodStarts, profile.cycleLength, profile.periodLength, today);

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto p-5 sm:p-8">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl leading-tight">Skin Cycle</h1>
            <p className="text-xs text-muted">{longDate.format(parseISO(today)!)}</p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="min-h-11 px-2 -mr-2 text-sm text-muted hover:text-ink transition"
          >
            Settings
          </button>
        </header>

        <nav aria-label="Sections" className="grid grid-cols-3 gap-1 mb-4 p-1 bg-surface border border-line rounded-2xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => go(t.id)}
              className={`min-h-11 rounded-xl text-sm transition ${
                tab === t.id ? 'bg-accent text-white font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main>
          {tab === 'today' && (
            <div className="space-y-4">
              <SkinToday info={info} skinType={profile.skinType} onOpenGuide={() => go('guide')} />
              <CheckIn
                log={logFor(today)}
                heading="Today’s routine"
                subheading="Tick what you did and how your skin feels."
                onChange={updateLog}
                justStarted={justStarted === today}
              />
              <CycleCard
                info={info}
                next={next}
                cycleLength={profile.cycleLength}
                periodLength={profile.periodLength}
                periodStartedToday={profile.periodStarts.includes(today)}
                canUndoPeriod={!onlyOneStart}
                onTogglePeriod={() => togglePeriodStart(today)}
              />
            </div>
          )}

          {tab === 'guide' && (
            <Guide
              currentPhase={info.phase}
              skinType={profile.skinType}
              selected={guidePhase ?? info.phase}
              onSelect={setGuidePhase}
            />
          )}

          {tab === 'diary' && (
            <div className="space-y-4">
              <Calendar
                profile={profile}
                logs={logs}
                today={today}
                selected={selected}
                onSelect={(iso) => {
                  setSelected(iso);
                  setJustStarted(null);
                }}
              />
              <CheckIn
                log={logFor(selected)}
                heading={selected === today ? 'Today' : longDate.format(parseISO(selected)!)}
                subheading={selectedInfo ? `Day ${selectedInfo.day} · ${selectedInfo.phase} phase` : undefined}
                onChange={updateLog}
                justStarted={justStarted === selected}
                periodToggle={{
                  on: profile.periodStarts.includes(selected),
                  disabled: profile.periodStarts.includes(selected) && onlyOneStart,
                  onToggle: () => togglePeriodStart(selected),
                }}
              />
              <Pattern summaries={summaries} hasSample={hasSample(logs)} onClearSample={clearSample} />
            </div>
          )}
        </main>

        <footer className="text-xs text-muted text-center mt-8 leading-relaxed">
          No account. Everything stays on this device.
        </footer>
      </div>
    </div>
  );
}
