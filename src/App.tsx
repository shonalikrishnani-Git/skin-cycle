import { useEffect, useMemo, useState } from 'react';
import { cycleInfoFor, nextPeriod, parseISO, todayISO } from './lib/cycle';
import {
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
import { Pattern } from './components/Pattern';
import { Setup } from './components/Setup';
import { TodayCard } from './components/TodayCard';

type Tab = 'today' | 'calendar';

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);

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

  const updateLog = (entry: DayLog) => {
    // Touching a sample entry makes it a real one.
    const nextLogs = upsertLog(logs, { ...entry, sample: false });
    saveLogs(nextLogs);
    setLogs(nextLogs);
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
            <p className="font-display text-2xl leading-tight">Skin Cycle</p>
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

        <nav aria-label="Sections" className="grid grid-cols-2 gap-1 mb-4 p-1 bg-surface border border-line rounded-2xl">
          {(['today', 'calendar'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-current={tab === t ? 'page' : undefined}
              onClick={() => {
                setTab(t);
                if (t === 'calendar') setSelected(today);
              }}
              className={`min-h-11 rounded-xl text-sm transition ${
                tab === t ? 'bg-accent text-white font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              {t === 'today' ? 'Today' : 'Calendar'}
            </button>
          ))}
        </nav>

        {tab === 'today' ? (
          <div className="space-y-4">
            <TodayCard
              info={info}
              next={next}
              cycleLength={profile.cycleLength}
              periodLength={profile.periodLength}
              periodStartedToday={profile.periodStarts.includes(today)}
              canUndoPeriod={!onlyOneStart}
              onTogglePeriod={() => togglePeriodStart(today)}
            />
            <CheckIn
              log={logFor(today)}
              heading="How's your skin today?"
              subheading="Ten seconds a day is all your pattern needs."
              onChange={updateLog}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Calendar profile={profile} logs={logs} today={today} selected={selected} onSelect={setSelected} />
            <CheckIn
              log={logFor(selected)}
              heading={selected === today ? 'Today' : longDate.format(parseISO(selected)!)}
              subheading={selectedInfo ? `Day ${selectedInfo.day} · ${selectedInfo.phase} phase` : undefined}
              onChange={updateLog}
              periodToggle={{
                on: profile.periodStarts.includes(selected),
                disabled: profile.periodStarts.includes(selected) && onlyOneStart,
                onToggle: () => togglePeriodStart(selected),
              }}
            />
            <Pattern summaries={summaries} hasSample={hasSample(logs)} onClearSample={clearSample} />
          </div>
        )}

        <footer className="text-xs text-muted text-center mt-8 leading-relaxed">
          No account. Everything stays on this device.
        </footer>
      </div>
    </div>
  );
}
