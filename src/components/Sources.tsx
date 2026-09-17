import { PHASES } from '../lib/cycle';
import {
  BREASTFEEDING_NOTE,
  DONT_TRY,
  EVIDENCE_NOTE,
  MYTHS,
  PHASE_GUIDE,
  PILL_NOTE,
  PREGNANCY_NOTE,
  SEE_SOMEONE,
  SOURCES,
  type Evidence,
} from '../lib/skin';
import { CARD, EVIDENCE_STYLE } from './guideStyles';

/** Matches the convention in README.md's Validation section — one AI validation pass, one date. */
const VERIFIED_ON = '14 Sep 2026';

const SOURCE_BY_ID: Record<string, { id: string; label: string; url: string }> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);

interface Row {
  id: string;
  claim: string;
  tag: string;
  evidence?: Evidence;
  typeLabel: string;
  sourceIds: string[];
}

interface Group {
  title: string;
  accentClass?: string;
  rows: Row[];
}

const PICK_CATEGORIES = [
  { key: 'hydrate', label: 'Hydrate' },
  { key: 'moisturise', label: 'Moisturise' },
  { key: 'goEasyOn', label: 'Go easy on' },
  { key: 'keepDoing', label: 'Keep doing' },
] as const;

/**
 * Every sourced claim in the guide, grouped the same way the Guide tab presents them. Built by
 * mapping over the real skin.ts exports, so a claim only appears here if skin.ts actually gives
 * it a `sourceIds` entry — this can't drift out of sync with the guidance because it isn't a
 * separate copy of it.
 */
function buildGroups(): Group[] {
  const groups: Group[] = [];

  for (const phase of PHASES) {
    const guide = PHASE_GUIDE[phase];
    const rows: Row[] = [];

    if (guide.tendency.sourceIds.length > 0) {
      rows.push({
        id: `${phase}-tendency`,
        claim: guide.tendency.text,
        tag: 'Tendency',
        typeLabel: 'Background research',
        sourceIds: guide.tendency.sourceIds,
      });
    }

    for (const { key, label } of PICK_CATEGORIES) {
      guide[key].forEach((pick, i) => {
        if (pick.sourceIds && pick.sourceIds.length > 0) {
          rows.push({
            id: `${phase}-${key}-${i}`,
            claim: pick.name,
            tag: label,
            typeLabel: 'Routine pick',
            sourceIds: pick.sourceIds,
          });
        }
      });
    }

    guide.homeCare.forEach((remedy, i) => {
      rows.push({
        id: `${phase}-homecare-${i}`,
        claim: remedy.name,
        tag: 'Home care',
        evidence: remedy.evidence,
        typeLabel: remedy.evidence,
        sourceIds: remedy.sourceIds,
      });
    });

    if (rows.length > 0) groups.push({ title: `${phase} phase`, rows });
  }

  const dontTry = DONT_TRY.filter((w) => w.sourceIds.length > 0).map(
    (w, i): Row => ({
      id: `dont-try-${i}`,
      claim: w.name,
      tag: 'Don’t try this at home',
      typeLabel: 'Safety warning',
      sourceIds: w.sourceIds,
    }),
  );
  if (dontTry.length > 0) groups.push({ title: 'Don’t try this at home', rows: dontTry });

  const myths = MYTHS.filter((m) => m.sourceIds.length > 0).map(
    (m, i): Row => ({
      id: `myth-${i}`,
      claim: `“${m.claim}”`,
      tag: 'Heard online',
      typeLabel: 'Myth check',
      sourceIds: m.sourceIds,
    }),
  );
  if (myths.length > 0) groups.push({ title: 'Heard online — not quite true', rows: myths });

  const seeSomeone = SEE_SOMEONE.filter((s) => s.sourceIds.length > 0).map(
    (s, i): Row => ({
      id: `see-someone-${i}`,
      claim: s.text,
      tag: 'See a pharmacist or GP',
      typeLabel: 'Safety note',
      sourceIds: s.sourceIds,
    }),
  );
  if (seeSomeone.length > 0) groups.push({ title: 'See a pharmacist or GP if you notice', rows: seeSomeone });

  const notes = [
    { id: 'note-pregnancy', claim: PREGNANCY_NOTE.text, tag: 'Pregnancy note', typeLabel: 'Health note', sourceIds: PREGNANCY_NOTE.sourceIds },
    { id: 'note-breastfeeding', claim: BREASTFEEDING_NOTE.text, tag: 'Breastfeeding note', typeLabel: 'Health note', sourceIds: BREASTFEEDING_NOTE.sourceIds },
    { id: 'note-pill', claim: PILL_NOTE.text, tag: 'Pill note', typeLabel: 'Health note', sourceIds: PILL_NOTE.sourceIds },
    { id: 'note-evidence', claim: EVIDENCE_NOTE.text, tag: 'How strong is the evidence?', typeLabel: 'Background research', sourceIds: EVIDENCE_NOTE.sourceIds },
  ].filter((n) => n.sourceIds.length > 0);
  if (notes.length > 0) groups.push({ title: 'Worth knowing', rows: notes });

  return groups;
}

function EvidenceOrType({ row }: { row: Row }) {
  if (row.evidence) {
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${EVIDENCE_STYLE[row.evidence]}`}>
        {row.evidence}
      </span>
    );
  }
  return <span className="text-xs text-muted whitespace-nowrap">{row.typeLabel}</span>;
}

function SourceLinks({ ids, className }: { ids: string[]; className: string }) {
  return (
    <div className="flex flex-col gap-1">
      {ids.map((id) => {
        const source = SOURCE_BY_ID[id];
        if (!source) return null;
        return (
          <a key={id} href={source.url} target="_blank" rel="noreferrer" className={className}>
            {source.label}
          </a>
        );
      })}
    </div>
  );
}

function GroupSection({ group }: { group: Group }) {
  return (
    <section aria-label={group.title} className={CARD}>
      <h2 className="font-display text-xl mb-4">{group.title}</h2>

      {/* Desktop / wide screens: a dense table. */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-muted">
              <th className="py-2 pr-3 font-normal">Claim</th>
              <th className="py-2 pr-3 font-normal">Section</th>
              <th className="py-2 pr-3 font-normal">Evidence</th>
              <th className="py-2 pr-3 font-normal">Source(s)</th>
              <th className="py-2 font-normal">Verified</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="py-3 pr-3 max-w-sm">{row.claim}</td>
                <td className="py-3 pr-3 text-muted whitespace-nowrap">{row.tag}</td>
                <td className="py-3 pr-3">
                  <EvidenceOrType row={row} />
                </td>
                <td className="py-3 pr-3 min-w-[14rem]">
                  <SourceLinks ids={row.sourceIds} className="text-accent underline underline-offset-2" />
                </td>
                <td className="py-3 text-muted whitespace-nowrap">{VERIFIED_ON}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow screens: the same rows as stacked cards instead of a cramped table. */}
      <ul className="sm:hidden flex flex-col gap-3">
        {group.rows.map((row) => (
          <li key={row.id} className="rounded-2xl bg-canvas border border-line p-4">
            <p className="text-sm font-semibold leading-snug">{row.claim}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-muted">{row.tag}</span>
              <EvidenceOrType row={row} />
            </div>
            <div className="mt-2">
              <SourceLinks
                ids={row.sourceIds}
                className="inline-flex items-center min-h-11 text-sm text-accent underline underline-offset-2"
              />
            </div>
            <p className="text-[10px] text-muted mt-1">Verified {VERIFIED_ON}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Every sourced claim in the guide, in one place: what it says, its evidence label where it has
 * one, the source(s) it's backed by, and when it was checked. Derived from src/lib/skin.ts at
 * render time — nothing here is hand-typed, so it can't quietly drift from the guidance itself.
 */
export function Sources({ onBack }: { onBack: () => void }) {
  const groups = buildGroups();
  const totalRows = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="min-h-11 text-sm text-accent underline underline-offset-2"
      >
        ← Back to guide
      </button>

      <section className={CARD}>
        <p className="text-xs uppercase tracking-widest text-muted mb-1.5">Sources</p>
        <h2 className="font-display text-2xl leading-tight text-balance">Every claim, traced to its source</h2>
        <p className="text-sm text-muted leading-relaxed mt-2 text-pretty">
          {totalRows} claims from across the guide, each linked to the source it’s backed by and
          built straight from the guidance data — so if the guidance changes, this list changes
          with it.
        </p>
        <p className="text-sm leading-relaxed mt-3 pt-3 border-t border-line">
          Verified {VERIFIED_ON} by AI validation agents, checked against sources they actually
          opened. Not yet reviewed by a pharmacist or dermatologist.
        </p>
      </section>

      {groups.map((group) => (
        <GroupSection key={group.title} group={group} />
      ))}

      <button
        type="button"
        onClick={onBack}
        className="w-full min-h-11 text-sm text-accent underline underline-offset-2"
      >
        ← Back to guide
      </button>
    </div>
  );
}
