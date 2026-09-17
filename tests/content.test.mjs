// Content tests. Run with: npm test  (Node 23.6+ strips the TypeScript types itself — no build step.)
//
// This guards against the drift a hiring-manager review flagged after the 14 Sep validation pass:
// a remedy losing its caution, a source that nothing references any more, or a README count that
// quietly falls out of step with the actual data. It does NOT re-verify the guidance against its
// real-world sources — that needs a human or an agent that actually opens each source — it only
// catches the app's own internal bookkeeping drifting.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  PHASE_GUIDE, DONT_TRY, MYTHS, SEE_SOMEONE, SKIN_TYPE_TIP,
  PREGNANCY_NOTE, BREASTFEEDING_NOTE, PILL_NOTE, EVIDENCE_NOTE, SOURCES,
} from '../src/lib/skin.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const README = readFileSync(join(__dirname, '..', 'README.md'), 'utf8');

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `\n      ${detail}`}`);
};

// --- Every remedy has a real caution and a real evidence label -------------------------------

const VALID_EVIDENCE = new Set(['Good evidence', 'Some evidence', 'Dermatologist advice', 'Low risk, little evidence']);
const allRemedies = Object.entries(PHASE_GUIDE).flatMap(([phase, guide]) => guide.homeCare.map((r) => ({ phase, ...r })));

check('every phase has at least one home-care remedy', Object.values(PHASE_GUIDE).every((g) => g.homeCare.length > 0));

for (const r of allRemedies) {
  check(`${r.phase} / "${r.name}" has a non-empty caution`, typeof r.caution === 'string' && r.caution.trim().length > 10,
    `caution was: ${JSON.stringify(r.caution)}`);
  check(`${r.phase} / "${r.name}" has a valid evidence label`, VALID_EVIDENCE.has(r.evidence),
    `evidence was: ${JSON.stringify(r.evidence)}`);
}

// --- Every DONT_TRY warning and MYTHS entry actually explains itself ------------------------

for (const w of DONT_TRY) {
  check(`don't-try "${w.name}" has a real reason`, typeof w.why === 'string' && w.why.trim().length > 10);
}
for (const m of MYTHS) {
  check(`myth "${m.claim}" has a real correction`, typeof m.truth === 'string' && m.truth.trim().length > 10);
}

// --- Every SOURCES entry is referenced by at least one guidance sentence ---------------------
//
// There's no inline citation system linking a sentence to a source id, so this is a hand-built
// map of label -> a distinctive substring that sentence actually contains today. If a future edit
// removes or rewrites the guidance a source backs, its keyword disappears from the text below and
// this fails, naming the now-unused source. If a source is added without adding a line here, that
// fails too, naming the source that needs wiring up.
const guidanceText = [
  ...Object.values(PHASE_GUIDE).flatMap((g) => [
    g.headline, g.tendency.text,
    ...[...g.hydrate, ...g.moisturise, ...g.goEasyOn, ...g.keepDoing].flatMap((p) => [p.name, p.why]),
    ...g.homeCare.flatMap((r) => [r.name, r.how, r.why, r.caution]),
  ]),
  ...DONT_TRY.flatMap((w) => [w.name, w.why]),
  ...MYTHS.flatMap((m) => [m.claim, m.truth]),
  ...SEE_SOMEONE.map((s) => s.text),
  ...Object.values(SKIN_TYPE_TIP),
  PREGNANCY_NOTE.text, BREASTFEEDING_NOTE.text, PILL_NOTE.text, EVIDENCE_NOTE.text,
].join(' \n ');

const KEYWORD_BY_LABEL = {
  'NHS — Fertility in the menstrual cycle': 'ovulation usually comes 10',
  'HSE — Periods': '21–35 days',
  'Review: skin across the menstrual cycle (2024)': '26 studies',
  'Skin irritation across the cycle (Agner, 1991)': 'a study of 29 women',
  'Skin barrier at ovulation vs a week later (2025)': 'a small study of 36 women',
  'Correction to the 2025 barrier study': 'held a little more at ovulation than a week later',
  'Premenstrual acne flares (Stoll et al., 2001)': 'in three studies',
  'Inflamed spots before a period (Lucky, 2004)': '65%',
  'Acne around the period (Geller et al., 2014)': '44%',
  'Facial redness across the cycle (Burriss et al., 2015)': '22 women',
  'Chin acne and androgens (2025)': '86 women',
  'Seed cycling — review (2025)': 'seed-cycling',
  'Panthenol and barrier repair (Proksch & Nissen, 2002)': 'panthenol',
  'AAD — How to pick a moisturiser': 'Ceramides are key fats',
  'AAD — Oily skin': 'labelled non-comedogenic',
  'Dr Zoe Draelos — Moisturisers and silicones': 'dimethicone',
  'AAD — Face washing 101': 'never scrub',
  'AAD — Habits that make acne worse': 'and can make breakouts worse',
  'AAD — How to test skin care products': 'coin-sized patch',
  'AAD — Treating a deep, painful pimple': 'deep, painful pimples',
  'AAD — Petroleum jelly': 'petroleum jelly',
  'AAD — Home itch relief for eczema (children)': 'eczema',
  'AAD — Skin care during pregnancy': 'Pregnant or trying to be',
  'AAD — Acne treatment in pregnancy': 'Spironolactone',
  'AAD — Adult acne treatment (toothpaste)': 'Toothpaste on spots',
  'AAD — Scars (hydrogen peroxide)': 'Hydrogen peroxide',
  'FDA — Alpha hydroxy acids and sun sensitivity': '18%',
  'Hydrocolloid patches for acne (Chao et al., 2006)': '20 people',
  'Hydrocolloid patches — review (2025)': 'absorbs fluid, protects the spot',
  'Green tea for acne and oil — review': 'Green tea lotions',
  'Clay mask study': 'masks mixing clay with other ingredients',
  'Skin pH and cleansers — review': '120 young people',
  'DermNet — Plant juice and sunlight burns': 'psoralens',
  'DermNet — Allergy to essential oils': 'lasting skin allergy',
  'Vinegar chemical burn — case report': 'Apple cider vinegar',
  'Garlic burn — case report': 'Raw garlic',
  'Cinnamon oil burn — case report': 'Cinnamon oil',
  'NHS — Acne': '6–8 weeks',
  'HSE — Acne treatment': 'acne getting you down',
  'NHS — Benzoyl peroxide': 'benzoyl peroxide',
  'DermNet — Salicylic acid': 'salicylic acid',
  'HSE — PCOS': 'polycystic ovary syndrome',
  'NHS — PMOS, previously called PCOS': 'PMOS',
  'Endocrine Society — PCOS name change (2026)': 'now being renamed PMOS',
  'NHS — Hirsutism (excess hair)': 'Thick, dark hair suddenly growing',
  'NHS — Cellulitis': 'red, swollen, hot, painful and spreading',
  'HSE — Cellulitis': 'pale, cold and clammy',
  'HSE — Anaphylaxis': 'lips, tongue or throat swell',
  'LactMed — Adapalene while breastfeeding': 'Ask a pharmacist before using a retinoid cream',
  'LactMed — Benzoyl peroxide while breastfeeding': 'considered low risk',
  'LactMed — Salicylic acid while breastfeeding': 'salicylic acid are considered low risk',
  'NHS — The combined pill': 'On the combined pill',
  'StatPearls — The menstrual cycle': '21–35 days',
  'Skin barrier across the cycle (Harvell et al., 1992)': 'skin lost a little less water just before ovulation than just before a period',
  'StatPearls — Moisturisers and humectants': 'hold water in the skin',
  'Petrolatum and skin barrier repair (Ghadially et al., 1992)': 'a study with human volunteers',
  'Colloidal oat lotion for dry, itchy skin': 'oat products eased dryness and itch',
  'Squalene oxidation in acne-prone skin (2023)': 'squalene',
  'AAD — Sunscreen facts': 'UVA stars',
  'NHS — Sunscreen and sun safety': 'reapply about every 2 hours',
  'AAD — Retinoid or retinol?': 'Use retinoids at night only',
  'AAD — Getting the most from skin care products': '6 weeks to show results',
  'AAD — Tips to relieve dry skin': 'Creams hold more water than lotions',
  'DermNet — Topical retinoids': 'building up slowly',
  'NHS — Itchy skin': 'itchy or irritated skin',
  'AAD — Hives self-care (cool compress)': 'Cooling soothes itch and irritation',
};

for (const source of SOURCES) {
  const keyword = KEYWORD_BY_LABEL[source.label];
  check(`source "${source.label}" has a test mapping`, keyword !== undefined,
    'this source was added to SOURCES without adding a line for it to KEYWORD_BY_LABEL in tests/content.test.mjs');
  if (keyword === undefined) continue;
  const used = guidanceText.toLowerCase().includes(keyword.toLowerCase());
  check(`source "${source.label}" is referenced in the guidance text`, used,
    `expected to find "${keyword}" somewhere in the guidance text, but it wasn't there — this source may now be unused`);
}

// Every mapping should point at a real, current source (catches a renamed/removed label leaving
// a stale, silently-ignored entry behind).
const sourceLabels = new Set(SOURCES.map((s) => s.label));
for (const label of Object.keys(KEYWORD_BY_LABEL)) {
  check(`mapped label "${label}" still exists in SOURCES`, sourceLabels.has(label));
}

// No two sources should share a URL or an exact label (a copy-paste duplicate).
check('no duplicate source URLs', new Set(SOURCES.map((s) => s.url)).size === SOURCES.length);
check('no duplicate source labels', new Set(SOURCES.map((s) => s.label)).size === SOURCES.length);

// --- Counts in this README must match the code, or one of them has drifted ------------------

const readmeSourcesInGuide = README.match(/and (\d+) sources\./)?.[1];
const readmeDontTryCount = README.match(/(\d+) don't-try items/)?.[1];
const readmeSourcesInVerified = README.match(/and (\d+) sources render/)?.[1];

check('README states a "NN sources." count in the Guide section', readmeSourcesInGuide !== undefined);
check('README "and NN sources." count matches SOURCES.length',
  Number(readmeSourcesInGuide) === SOURCES.length,
  `README says ${readmeSourcesInGuide}, SOURCES has ${SOURCES.length} entries — update README.md`);

check('README states a "NN don\'t-try items" count in Verified', readmeDontTryCount !== undefined);
check('README "NN don\'t-try items" count matches DONT_TRY.length',
  Number(readmeDontTryCount) === DONT_TRY.length,
  `README says ${readmeDontTryCount}, DONT_TRY has ${DONT_TRY.length} entries — update README.md`);

check('README states a "NN sources render" count in Verified', readmeSourcesInVerified !== undefined);
check('README "and NN sources render" count matches SOURCES.length',
  Number(readmeSourcesInVerified) === SOURCES.length,
  `README says ${readmeSourcesInVerified}, SOURCES has ${SOURCES.length} entries — update README.md`);

// --- Stray wording that was deliberately cut should never reappear on screen -----------------

const HONEY_ALOE = /\b(honey|aloe)\b/i;
check('no home-care remedy mentions honey or aloe', !allRemedies.some((r) => HONEY_ALOE.test(`${r.name} ${r.how} ${r.why}`)));
check('no on-screen guidance text mentions honey or aloe', !HONEY_ALOE.test(guidanceText));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
