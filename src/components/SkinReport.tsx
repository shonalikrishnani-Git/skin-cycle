import { useState } from 'react';
import { PHASE_META, parseISO } from '../lib/cycle';
import { hasSample, type DayLog } from '../lib/log';
import { buildReport, type ReportRange } from '../lib/report';
import type { Profile } from '../lib/storage';
import { ChevronIcon } from './Icons';

const CARD = 'report-card bg-surface border border-line rounded-3xl p-6';
const longDate = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const RANGES: { id: ReportRange; label: string }[] = [
  { id: '6w', label: 'Last 6 weeks' },
  { id: 'all', label: 'All time' },
];

/**
 * Her own logs, on one honest page — to read herself, or save as a PDF for a pharmacist or GP.
 * Nothing here is a new claim: it's the same phase averages, tags and home-care count already on
 * the diary, laid out for someone who wasn't there while she logged them.
 */
export function SkinReport({
  logs,
  profile,
  today,
  onBack,
  onClearSample,
}: {
  logs: DayLog[];
  profile: Profile;
  today: string;
  onBack: () => void;
  onClearSample: () => void;
}) {
  const [range, setRange] = useState<ReportRange>('6w');
  // Notes are opt-in for print: off by default, so a private note never lands on a page she hands
  // to someone else by accident.
  const [shown, setShown] = useState<Set<string>>(new Set());

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      className="no-print min-h-11 -ml-1 px-1 flex items-center gap-1 text-sm text-muted hover:text-ink transition"
    >
      <ChevronIcon direction="left" /> Back
    </button>
  );

  if (!logs.some((l) => !l.sample)) {
    return (
      <section aria-label="Skin report" className={CARD}>
        {backButton}
        <h1 className="font-display text-2xl mt-3 mb-2">Skin report</h1>
        <p className="text-sm text-muted leading-relaxed">
          Your report needs a couple of weeks of your own entries before it has anything honest to say. Log a few
          real days — routine, rating, a tag or two — and it’ll be here.
        </p>
        {hasSample(logs) && (
          <button
            type="button"
            onClick={onClearSample}
            className="mt-4 min-h-11 text-xs underline text-ovulatory-ink hover:opacity-70"
          >
            Remove the sample entries
          </button>
        )}
      </section>
    );
  }

  const report = buildReport(logs, profile, today, range);
  const dayWord = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

  const toggleNote = (date: string) =>
    setShown((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });

  return (
    <div className="space-y-4">
      <div>
        {backButton}
        <h1 className="font-display text-3xl mt-2">Skin report</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">
          {longDate.format(parseISO(report.from)!)} – {longDate.format(parseISO(report.to)!)} ·{' '}
          {dayWord(report.loggedDays)} logged
          {report.periodsLogged > 0 &&
            ` · ${report.periodsLogged} period${report.periodsLogged === 1 ? '' : 's'} started`}
        </p>
      </div>

      <div
        role="group"
        aria-label="Report range"
        className="no-print grid grid-cols-2 gap-1 p-1 bg-surface border border-line rounded-2xl"
      >
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={range === r.id}
            onClick={() => setRange(r.id)}
            className={`min-h-11 rounded-xl text-sm transition ${
              range === r.id ? 'bg-accent text-white font-semibold' : 'text-muted hover:text-ink'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <section aria-label="By phase" className={CARD}>
        <h2 className="font-display text-xl mb-4">By phase</h2>
        <ul className="space-y-4">
          {report.phases.map((s) => {
            const meta = PHASE_META[s.phase];
            return (
              <li key={s.phase}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                    {s.phase}
                  </span>
                  <span className="text-xs text-muted">
                    {s.avgSkin === null ? 'no ratings yet' : `${s.avgSkin.toFixed(1)} / 5 · ${dayWord(s.ratedDays)}`}
                  </span>
                </div>
                <div
                  className="h-2 bg-line rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`${s.phase} average skin rating`}
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-valuenow={s.avgSkin === null ? undefined : Number(s.avgSkin.toFixed(1))}
                >
                  <div className={`h-full rounded-full ${meta.dot}`} style={{ width: `${((s.avgSkin ?? 0) / 5) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Routine and skin" className={CARD}>
        <h2 className="font-display text-xl mb-3">Routine and skin</h2>
        {report.routine ? (
          <>
            <p className="text-sm leading-relaxed">
              On days you did most of both routines, you rated your skin{' '}
              <strong>{report.routine.bothAvg.toFixed(1)}</strong>. On other days,{' '}
              <strong>{report.routine.otherAvg.toFixed(1)}</strong>.
            </p>
            <p className="text-xs text-muted leading-relaxed mt-2">
              Linked, not proof — a rough skin day might be why a routine got skipped.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted leading-relaxed">Not enough days yet to compare routine and skin.</p>
        )}
      </section>

      <section aria-label="Top tags and home care" className={CARD}>
        <h2 className="font-display text-xl mb-3">Top tags</h2>
        {report.topTags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 mb-4">
            {report.topTags.map((t) => (
              <li key={t.tag} className="min-h-11 px-4 flex items-center rounded-full border border-line text-[13px]">
                {t.tag}
                <span className="text-muted ml-1.5">· {t.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted mb-4">Nothing tagged in this range.</p>
        )}
        <p className="text-sm text-muted">Home care on {dayWord(report.homeCareDays)}.</p>
      </section>

      <section aria-label="Notes" className={CARD}>
        <h2 className="font-display text-xl mb-1">Notes</h2>
        <p className="no-print text-xs text-muted mb-4 leading-relaxed">
          Off by default — switch on the ones worth showing before you save or print.
        </p>
        {report.notes.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {report.notes.map((n) => {
              const on = shown.has(n.date);
              return (
                <li
                  key={n.date}
                  className={`${on ? '' : 'note-off'} flex items-start justify-between gap-3 p-3 rounded-2xl border ${
                    on ? 'border-accent bg-accent-soft' : 'border-line'
                  }`}
                >
                  <div>
                    <p className="text-xs text-muted">{longDate.format(parseISO(n.date)!)}</p>
                    <p className="text-sm mt-0.5">{n.note}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleNote(n.date)}
                    className={`no-print shrink-0 min-h-11 px-3 rounded-full border text-xs transition ${
                      on ? 'border-accent bg-accent text-white' : 'border-line text-muted hover:border-muted'
                    }`}
                  >
                    {on ? 'Included' : 'Include'}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">No notes in this range.</p>
        )}
      </section>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print w-full min-h-12 rounded-2xl bg-accent text-white font-semibold hover:opacity-90 transition"
      >
        Save as PDF
      </button>

      <p className="text-xs text-muted text-center leading-relaxed">
        Self-tracked, not a diagnosis. Nothing leaves your phone unless you save or print it.
      </p>
    </div>
  );
}
