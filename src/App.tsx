import { useEffect, useMemo, useState } from 'react';
import { APP_NAME } from './lib/brand';
import { addDays, ageOn, cycleInfoFor, daysBetween, nextPeriod, parseISO, todayISO, type Phase } from './lib/cycle';
import {
  DEFAULT_ROUTINE,
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
import { GearIcon, LogoMark } from './components/Icons';
import { Onboarding, SITE_HOME } from './components/Onboarding';
import { Pattern } from './components/Pattern';
import { Settings } from './components/Settings';
import { SkinToday } from './components/SkinToday';
import { TOUR, Tour, type TourTarget } from './components/Tour';

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

/** Two period starts closer than this are one period logged twice, not a 3-day cycle. */
const SAME_PERIOD_DAYS = 14;

/** Today's date, kept current if the app is left open past midnight. */
function useToday(): string {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    const check = () => setToday((t) => (t === todayISO() ? t : todayISO()));
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return today;
}

/**
 * The tour's sample person, Maya: combination skin, day 22 of a 28-day cycle, three logged periods.
 * Held in memory only — the demo never reads or writes anyone's real diary.
 */
function demoData(today: string): { profile: Profile; logs: DayLog[] } {
  const start = addDays(today, -21);
  const profile: Profile = {
    name: 'Maya',
    birthDate: `${Number(today.slice(0, 4)) - 29}-01-15`,
    periodStarts: [addDays(start, -56), addDays(start, -28), start],
    cycleLength: 28,
    periodLength: 5,
    skinType: 'Combination',
    routine: { am: [...DEFAULT_ROUTINE.am], pm: [...DEFAULT_ROUTINE.pm] },
  };
  // Shown as her own entries (not "sample"), so the tour reads like a real diary.
  const logs = sampleHistory(profile, today).map((l) => ({ ...l, sample: false }));
  return { profile, logs };
}

/** `?tour` (or `?tour=3`) opens straight into the guided tour — used by the landing page. */
function tourFromUrl(): number | null {
  const q = new URLSearchParams(window.location.search);
  if (!q.has('tour')) return null;
  const n = Number(q.get('tour') || 1) - 1;
  return Number.isInteger(n) && n >= 0 && n < TOUR.length ? n : 0;
}

/**
 * `?shot=today|guide|diary` shows the tour's sample diary with no tour card or banner, and today
 * filled in. Only used to take the landing page's screenshots (see README), never linked.
 */
function shotFromUrl(): Tab | null {
  const v = new URLSearchParams(window.location.search).get('shot');
  return TABS.some((t) => t.id === v) ? (v as Tab) : null;
}

export default function App() {
  const today = useToday();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [tab, setTab] = useState<Tab>('today');
  const [selected, setSelected] = useState(todayISO);
  /** null = follow the current phase; set when browsing another phase in the guide. */
  const [guidePhase, setGuidePhase] = useState<Phase | null>(null);
  const [settings, setSettings] = useState<null | 'all' | 'routine'>(null);
  const [ready, setReady] = useState(false);
  /** The date whose sample data was JUST replaced by a real entry, so we can explain the switch once. */
  const [justStarted, setJustStarted] = useState<string | null>(null);
  /** The guided tour: its step, and the sample diary it runs on. null when not touring. */
  const [tour, setTour] = useState<number | null>(null);
  const [demo, setDemo] = useState<{ profile: Profile; logs: DayLog[] } | null>(null);
  const [screenshot, setScreenshot] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setLogs(loadLogs());
    const start = tourFromUrl();
    const shot = shotFromUrl();
    if (start !== null) {
      setDemo(demoData(todayISO()));
      setTour(start);
    } else if (shot) {
      const d = demoData(todayISO());
      const filled = { ...emptyLog(todayISO()), am: [...d.profile.routine.am], pm: [], skin: 4 };
      setDemo({ ...d, logs: upsertLog(d.logs, filled) });
      setScreenshot(true);
      setTab(shot);
    }
    setReady(true);
  }, []);

  const touring = demo !== null && !screenshot;
  const activeProfile = demo?.profile ?? profile;
  const activeLogs = demo?.logs ?? logs;

  const summaries = useMemo(
    () => (activeProfile ? summariseByPhase(activeLogs, activeProfile) : []),
    [activeLogs, activeProfile],
  );

  // Each tour stop opens its tab and scrolls its part of the screen into view.
  useEffect(() => {
    if (tour === null) return;
    const stop = TOUR[tour];
    setTab(stop.tab);
    setGuidePhase(null);
    setSelected(todayISO());
    const t = window.setTimeout(() => {
      const el = document.querySelector(`[data-tour="${stop.target}"]`);
      if (!el) return;
      if (stop.target === 'skin-today' || stop.tab === 'guide') window.scrollTo({ top: 0, behavior: 'smooth' });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(t);
  }, [tour]);

  // The routine stop fills in today's entry one tap at a time, so the diary is seen working.
  useEffect(() => {
    if (tour === null || TOUR[tour].target !== 'routine' || !demo) return;
    const day = todayISO();
    const { am } = demo.profile.routine;
    const taps: ((l: DayLog) => DayLog)[] = [
      ...am.map((_, i) => (l: DayLog) => ({ ...l, am: am.slice(0, i + 1) })),
      (l: DayLog) => ({ ...l, skin: 4 }),
    ];
    const timers = taps.map((tap, i) =>
      window.setTimeout(() => {
        setDemo((d) => {
          if (!d) return d;
          const base = i === 0 ? emptyLog(day) : (d.logs.find((l) => l.date === day) ?? emptyLog(day));
          return { ...d, logs: upsertLog(d.logs, tap(base)) };
        });
      }, 700 + i * 420),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Only restart when the stop changes (or the tour starts), not on every tap it makes.
  }, [tour, demo === null]);

  if (!ready) return null;

  const startTour = () => {
    setDemo(demoData(todayISO()));
    setTour(0);
  };

  const endTour = () => {
    setDemo(null);
    setTour(null);
    setTab('today');
    setSelected(todayISO());
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo(0, 0);
  };

  if (!activeProfile) {
    return (
      <Onboarding
        onTour={startTour}
        onSave={(p) => {
          const seeded = sampleHistory(p, today);
          saveProfile(p);
          saveLogs(seeded);
          setProfile(p);
          setLogs(seeded);
          setSelected(today);
          setGuidePhase(null);
          setTab('today');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const saveProfileChange = (p: Profile) => {
    if (demo) return setDemo((d) => (d ? { ...d, profile: p } : d));
    saveProfile(p);
    setProfile(p);
  };

  const saveLogsChange = (next: DayLog[]) => {
    if (demo) return setDemo((d) => (d ? { ...d, logs: next } : d));
    saveLogs(next);
    setLogs(next);
  };

  if (settings && !demo) {
    return (
      <Settings
        profile={activeProfile}
        focus={settings === 'routine' ? 'routine' : undefined}
        onChange={saveProfileChange}
        onClose={() => {
          setSettings(null);
          window.scrollTo(0, 0);
        }}
        onDeleteAll={() => {
          clearAllData();
          setProfile(null);
          setLogs([]);
          setSettings(null);
          setTab('today');
        }}
      />
    );
  }

  const p = activeProfile;
  const info = cycleInfoFor(today, p.periodStarts, p.cycleLength, p.periodLength, today)!;
  const next = nextPeriod(p.periodStarts, p.cycleLength, today);
  const onlyOneStart = p.periodStarts.length === 1;

  const go = (t: Tab) => {
    setTab(t);
    if (t === 'diary') setSelected(today);
    if (t === 'guide') setGuidePhase(null);
    window.scrollTo(0, 0);
  };

  const updateLog = (entry: DayLog) => {
    const previous = activeLogs.find((l) => l.date === entry.date);
    const wasSample = previous?.sample ?? false;
    const real = previous && wasSample ? adoptSampleEdit(previous, entry) : { ...entry, sample: false };
    saveLogsChange(upsertLog(activeLogs, real));
    if (wasSample) setJustStarted(entry.date);
  };

  const togglePeriodStart = (iso: string) => {
    if (iso > today) return;
    const logged = p.periodStarts.includes(iso);
    // The cycle needs at least one anchor date, so the last one can't be removed.
    if (logged && onlyOneStart) return;
    // A start a few days from one already logged is a correction of that period, not a new cycle.
    const others = p.periodStarts.filter((d) => Math.abs(daysBetween(d, iso)) >= SAME_PERIOD_DAYS);
    const periodStarts = logged ? p.periodStarts.filter((d) => d !== iso) : [...others, iso].sort();
    saveProfileChange({ ...p, periodStarts });
  };

  const clearSample = () => saveLogsChange(withoutSample(activeLogs));

  const logFor = (iso: string) => activeLogs.find((l) => l.date === iso) ?? emptyLog(iso);
  const selectedInfo = cycleInfoFor(selected, p.periodStarts, p.cycleLength, p.periodLength, today);
  const focusTarget: TourTarget | null = tour !== null ? TOUR[tour].target : null;
  const tourRing = (t: TourTarget) => (focusTarget === t ? 'tour-focus' : '');

  return (
    <div className={`min-h-screen ${touring ? 'pb-72' : ''}`}>
      {touring && (
        <div className="sticky top-0 z-30 bg-ink/95 backdrop-blur text-white text-xs">
          <div className="max-w-xl mx-auto px-4 sm:px-8 min-h-10 flex items-center justify-between gap-3">
            <span>
              <strong className="font-semibold">Demo</strong> · sample diary, nothing is saved
            </span>
            <button type="button" onClick={endTour} className="min-h-10 underline underline-offset-2">
              Exit
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-5 sm:p-8">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LogoMark size={36} className="anim-spin-in" />
            <div>
              <h1 className="font-display text-2xl leading-none">{p.name ? `Hi, ${p.name.split(' ')[0]}` : APP_NAME}</h1>
              <p className="text-xs text-muted mt-1">{longDate.format(parseISO(today)!)}</p>
            </div>
          </div>
          {!touring && (
            <button
              type="button"
              onClick={() => setSettings('all')}
              aria-label="Settings"
              className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition"
            >
              <GearIcon />
            </button>
          )}
        </header>

        {/* The tabs stay in reach while scrolling, on a backdrop so content doesn't show around them. */}
        <div
          className={`sticky z-20 -mx-4 px-4 sm:-mx-8 sm:px-8 pt-2 pb-3 mb-1 bg-canvas/90 backdrop-blur ${touring ? 'top-10' : 'top-0'}`}
        >
          <nav
            aria-label="Sections"
            className="grid grid-cols-3 gap-1 p-1 bg-surface border border-line rounded-2xl shadow-[0_8px_24px_-18px_rgba(45,35,49,0.5)]"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? 'page' : undefined}
                onClick={() => go(t.id)}
                className={`min-h-11 rounded-xl text-sm transition ${
                  tab === t.id ? 'bg-accent text-white font-semibold shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <main>
          {tab === 'today' && (
            <div className="space-y-4 anim-fade-up">
              <div data-tour="skin-today" className={`scroll-mt-40 rounded-3xl ${tourRing('skin-today')}`}>
                <SkinToday info={info} skinType={p.skinType} onOpenGuide={() => go('guide')} />
              </div>
              <div data-tour="routine" className={`scroll-mt-40 rounded-3xl ${tourRing('routine')}`}>
                <CheckIn
                  log={logFor(today)}
                  routine={p.routine}
                  heading="Today’s routine"
                  onChange={updateLog}
                  onEditRoutine={touring ? undefined : () => setSettings('routine')}
                  justStarted={justStarted === today}
                />
              </div>
              <CycleCard
                info={info}
                next={next}
                cycleLength={p.cycleLength}
                periodLength={p.periodLength}
                periodStartedToday={p.periodStarts.includes(today)}
                canUndoPeriod={!onlyOneStart}
                onTogglePeriod={() => togglePeriodStart(today)}
              />
            </div>
          )}

          {tab === 'guide' && (
            <div data-tour="guide" className={`rounded-3xl anim-fade-up ${tourRing('guide')}`}>
              <Guide
                currentPhase={info.phase}
                skinType={p.skinType}
                selected={guidePhase ?? info.phase}
                onSelect={setGuidePhase}
              />
            </div>
          )}

          {tab === 'diary' && (
            <div className="space-y-4 anim-fade-up">
              <Calendar
                profile={p}
                logs={activeLogs}
                today={today}
                selected={selected}
                onSelect={(iso) => {
                  setSelected(iso);
                  setJustStarted(null);
                }}
              />
              {!touring && (
                <CheckIn
                  log={logFor(selected)}
                  routine={p.routine}
                  heading={selected === today ? 'Today' : longDate.format(parseISO(selected)!)}
                  subheading={selectedInfo ? `Day ${selectedInfo.day} · ${selectedInfo.phase} phase` : undefined}
                  onChange={updateLog}
                  justStarted={justStarted === selected}
                  periodToggle={{
                    on: p.periodStarts.includes(selected),
                    disabled: p.periodStarts.includes(selected) && onlyOneStart,
                    onToggle: () => togglePeriodStart(selected),
                  }}
                />
              )}
              <div data-tour="pattern" className={`scroll-mt-40 rounded-3xl ${tourRing('pattern')}`}>
                <Pattern summaries={summaries} hasSample={hasSample(activeLogs)} onClearSample={clearSample} />
              </div>
            </div>
          )}
        </main>

        <footer className="text-xs text-muted text-center mt-10">
          Stays on this device ·{' '}
          <a href={SITE_HOME} className="underline underline-offset-2 hover:text-ink">
            About
          </a>
          {!touring && (
            <>
              {' '}
              ·{' '}
              <button type="button" onClick={startTour} className="min-h-11 underline underline-offset-2 hover:text-ink">
                Demo
              </button>
            </>
          )}
        </footer>
      </div>

      {tour !== null && (
        <Tour
          step={tour}
          person={{
            name: p.name,
            age: p.birthDate ? ageOn(p.birthDate, today) : null,
            skinType: p.skinType,
            day: info.day,
            cycleLength: p.cycleLength,
            phase: info.phase,
          }}
          onStep={setTour}
          onExit={endTour}
          onStartOwn={() => {
            endTour();
          }}
        />
      )}
    </div>
  );
}
