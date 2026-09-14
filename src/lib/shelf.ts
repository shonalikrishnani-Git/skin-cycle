/**
 * Shelf Sync — timing tips for the products you already own, not new ones to buy.
 *
 * Every rule below is a plain restatement of something already said in `skin.ts`'s
 * PHASE_GUIDE (hydrate / moisturise / goEasyOn / keepDoing / homeCare) — nothing new is
 * claimed here, and no active is scored on anything beyond that existing guidance. "Ease off"
 * never means "stop": that word is reserved for the goEasyOn language the rest of the app
 * already uses.
 *
 * Persistence lives in storage.ts, the app's one place that touches localStorage — this file
 * only holds the shelf's shape and the rule table.
 */
import { daysBetween, type Phase } from './cycle';
import type { SkinType } from './skin';

export type ProductStep = 'Cleanser' | 'Serum' | 'Moisturiser' | 'Treatment' | 'Sunscreen' | 'Other';

export const PRODUCT_STEPS: ProductStep[] = ['Cleanser', 'Serum', 'Moisturiser', 'Treatment', 'Sunscreen', 'Other'];

// Ingredient TYPES only, same rule skin.ts follows — never a brand.
export type ActiveId =
  | 'hyaluronic-acid'
  | 'glycerin'
  | 'panthenol'
  | 'ceramides'
  | 'squalane'
  | 'petroleum-jelly'
  | 'retinoid'
  | 'aha'
  | 'bha'
  | 'benzoyl-peroxide'
  | 'vitamin-c'
  | 'azelaic-acid'
  | 'face-oil-or-rich-cream'
  | 'sunscreen'
  | 'none';

export const ACTIVES: { id: ActiveId; label: string }[] = [
  { id: 'hyaluronic-acid', label: 'Hyaluronic acid' },
  { id: 'glycerin', label: 'Glycerin' },
  { id: 'panthenol', label: 'Panthenol (vitamin B5)' },
  { id: 'ceramides', label: 'Ceramides' },
  { id: 'squalane', label: 'Squalane' },
  { id: 'petroleum-jelly', label: 'Petroleum jelly' },
  { id: 'retinoid', label: 'Retinoid (retinol / retinal / adapalene)' },
  { id: 'aha', label: 'AHA (glycolic / lactic)' },
  { id: 'bha', label: 'BHA (salicylic acid)' },
  { id: 'benzoyl-peroxide', label: 'Benzoyl peroxide' },
  { id: 'vitamin-c', label: 'Vitamin C' },
  { id: 'azelaic-acid', label: 'Azelaic acid' },
  { id: 'face-oil-or-rich-cream', label: 'Face oil or rich cream' },
  { id: 'sunscreen', label: 'Sunscreen' },
  { id: 'none', label: 'None of these' },
];

export function activeLabel(id: ActiveId): string {
  return ACTIVES.find((a) => a.id === id)?.label ?? id;
}

export interface ShelfProduct {
  id: string;
  name: string;
  step: ProductStep;
  active: ActiveId;
  /** YYYY-MM-DD */
  addedOn: string;
}

export function addProduct(products: ShelfProduct[], product: ShelfProduct): ShelfProduct[] {
  return [...products, product];
}

export function removeProduct(products: ShelfProduct[], id: string): ShelfProduct[] {
  return products.filter((p) => p.id !== id);
}

// --- The rule table ----------------------------------------------------------------------
//
// Validated 14 Sep 2026 by an independent agent against AAD, NHS, FDA and PubMed sources. What
// came out of that review, and now governs this table:
//   - Treatments (retinoids, acids, benzoyl peroxide, azelaic acid) are NEVER "ease off" because of
//     a phase. People use them for acne, often on prescription, and skipping them makes acne
//     worse. Where a phase might matter — more stinging around a period — the condition goes in
//     the why, and prescribed use always defers to the prescriber.
//   - "Ease off" survives only as texture advice that depends on the user's skin type.
//   - Acne-prone warnings for oils, petroleum jelly and squalane apply all month, not one week.
//   - Standing safety cautions (pregnancy, sun, bleaching, combining treatments) show in EVERY
//     phase, via cautionsFor().

export type Timing = 'lean' | 'steady' | 'ease';

export interface TimingRule {
  timing: Timing;
  why: string;
}

const PRESCRIBED =
  'Prescribed? Use it as prescribed, and ask your GP, dermatologist or pharmacist before changing how often you use it.';
const STINGS_AROUND_PERIOD =
  'If it stings more than usual around your period, use it less often for a few nights, then build back up.';
const START_ONE = 'New to it? This can be a handy week to start one — just one new product at a time.';
const TOLERATED = 'Actives you already tolerate can carry on as usual.';
const STEADY_LUTEAL = 'Keep it steady — if you break out this week, a change makes it harder to tell what caused it.';
const DONT_PILE_ON =
  'Keep to your usual amount, even if spots appear — using more than directed dries and irritates skin, and irritation can bring more breakouts.';
const ACNE_PRONE_TEXTURE =
  'Acne-prone? Oils and heavy creams can clog pores in any week — choose an oil-free, non-comedogenic moisturiser instead.';

const all = (rule: TimingRule): Record<Phase, TimingRule> => ({
  Menstrual: rule,
  Follicular: rule,
  Ovulatory: rule,
  Luteal: rule,
});

const HYDRATOR: Record<Phase, TimingRule> = {
  Menstrual: {
    timing: 'lean',
    why: 'Gentle while skin may react more easily. Apply to damp skin, then always follow with moisturiser.',
  },
  Follicular: { timing: 'lean', why: 'Simple hydration is usually enough — a serum under your moisturiser.' },
  Ovulatory: { timing: 'lean', why: 'A light layer is usually enough. Apply to damp skin, then follow with moisturiser.' },
  Luteal: { timing: 'lean', why: 'Keeps adding water. Acne-prone? Check it’s oil-free or labelled non-comedogenic.' },
};

const RULES: Record<ActiveId, Record<Phase, TimingRule>> = {
  'hyaluronic-acid': HYDRATOR,
  glycerin: HYDRATOR,
  panthenol: {
    Menstrual: {
      timing: 'lean',
      why: 'In a controlled study, a panthenol cream helped skin recover faster after irritation — a gentle one while skin may be more reactive.',
    },
    Follicular: { timing: 'steady', why: 'Useful if a new active is drying your skin — otherwise keep it as it is.' },
    Ovulatory: { timing: 'steady', why: 'No specific timing tip this week — keep it as it is.' },
    Luteal: { timing: 'lean', why: 'A gentle one to keep using. In a controlled study, panthenol helped irritated skin recover faster.' },
  },
  ceramides: {
    Menstrual: {
      timing: 'lean',
      why: 'Ceramides are key fats in the skin barrier. Dry skin: a richer cream. Oily skin: a light, non-comedogenic gel.',
    },
    Follicular: { timing: 'steady', why: 'Keep your ceramide moisturiser going — it helps if a new active dries your skin.' },
    Ovulatory: { timing: 'steady', why: 'Keep it going, especially on drier skin.' },
    Luteal: {
      timing: 'lean',
      why: 'Dry skin: a ceramide cream. Oily or acne-prone: a light, non-comedogenic ceramide lotion or gel-cream.',
    },
  },
  squalane: all({
    timing: 'steady',
    why: 'No specific timing tip. It’s often called non-clogging, but that hasn’t been properly tested in people — if you’re acne-prone, watch how your skin responds.',
  }),
  'petroleum-jelly': all({
    timing: 'steady',
    why: 'Acne-prone? Keep it off your face — it may cause breakouts. On dry patches, lips or body, a thin layer over moisturiser on damp skin seals water in.',
  }),
  retinoid: {
    Menstrual: {
      timing: 'steady',
      why: `Keep to your usual routine. ${PRESCRIBED} Bought it yourself and it stings more this week? Use it less often for a few nights, then build back up.`,
    },
    Follicular: {
      timing: 'steady',
      why: 'Bought it yourself and new to it? This can be a handy week to start — at night, every other night, building up slowly, one new product at a time. Prescribed? Start when your prescriber says. Very dry skin? Wait until it settles.',
    },
    Ovulatory: { timing: 'steady', why: TOLERATED },
    Luteal: { timing: 'steady', why: STEADY_LUTEAL },
  },
  aha: {
    Menstrual: { timing: 'steady', why: `Keep it steady. ${STINGS_AROUND_PERIOD}` },
    Follicular: { timing: 'steady', why: START_ONE },
    Ovulatory: { timing: 'steady', why: TOLERATED },
    Luteal: { timing: 'steady', why: STEADY_LUTEAL },
  },
  bha: {
    Menstrual: { timing: 'steady', why: `Keep to your usual routine. ${STINGS_AROUND_PERIOD}` },
    Follicular: { timing: 'steady', why: START_ONE },
    Ovulatory: { timing: 'steady', why: TOLERATED },
    Luteal: { timing: 'steady', why: DONT_PILE_ON },
  },
  'benzoyl-peroxide': {
    Menstrual: {
      timing: 'steady',
      why: `Keep it steady. It can sting or dry skin in any week — if it does, use it less often until it settles. ${PRESCRIBED}`,
    },
    Follicular: { timing: 'steady', why: `Keep it steady. ${PRESCRIBED}` },
    Ovulatory: { timing: 'steady', why: TOLERATED },
    Luteal: { timing: 'steady', why: DONT_PILE_ON },
  },
  'vitamin-c': {
    Menstrual: {
      timing: 'steady',
      why: 'Keep it steady. If a strong one stings more than usual around your period, use it less often for a few nights.',
    },
    Follicular: { timing: 'steady', why: START_ONE },
    Ovulatory: { timing: 'steady', why: TOLERATED },
    Luteal: { timing: 'steady', why: 'Keep your usual vitamin C steady.' },
  },
  'azelaic-acid': {
    Menstrual: {
      timing: 'steady',
      why: `Keep it steady. ${PRESCRIBED} Bought it yourself and it stings more this week? Use it less often for a few nights, then build back up.`,
    },
    Follicular: { timing: 'steady', why: 'Keep it steady — it usually takes about a month to help.' },
    Ovulatory: { timing: 'steady', why: 'Keep it steady — it usually takes about a month to help.' },
    Luteal: { timing: 'steady', why: 'Keep it steady — it usually takes about a month to help.' },
  },
  'face-oil-or-rich-cream': all({
    timing: 'steady',
    why: `Dry skin: a richer texture suits you all month. ${ACNE_PRONE_TEXTURE}`,
  }),
  sunscreen: all({
    timing: 'lean',
    why: 'Every day, in every phase — especially if you use an AHA, retinoid or benzoyl peroxide, which can make skin burn more easily.',
  }),
  none: all({ timing: 'steady', why: 'No active picked — nothing here to lean into or ease off.' }),
};

/** Standing cautions that apply in every phase, whatever the week. */
const CAUTIONS: Partial<Record<ActiveId, string[]>> = {
  retinoid: [
    'Pregnant or trying to be? Don’t use a retinoid. Breastfeeding? Ask a pharmacist first.',
    'Use it at night, and wear sunscreen every day.',
    'Don’t combine it with benzoyl peroxide unless a pharmacist or doctor says you can.',
  ],
  aha: ['Wear sunscreen every day while you use it, and for a week after you stop.'],
  bha: ['Wear sunscreen every day while you use it.', 'Pregnant or breastfeeding? Check with a pharmacist first.'],
  'benzoyl-peroxide': [
    'Keep it off hair, towels, clothes and bedding — it can bleach them.',
    'It can make skin more sensitive to the sun — wear sunscreen every day.',
    'Pregnant? Check with a pharmacist first.',
    'Don’t combine it with a retinoid unless a pharmacist or doctor says you can.',
  ],
  'vitamin-c': ['Stronger than 20%? In lab tests skin didn’t absorb more, and stronger products may irritate.'],
};

export function timingFor(active: ActiveId, phase: Phase, skinType: SkinType): TimingRule {
  // The one skin-type-dependent "ease off": oils and heavy creams before a period, for skin that
  // tends to break out. Dry skin keeps its richer texture — telling it to ease off would
  // contradict the guide.
  if (active === 'face-oil-or-rich-cream' && phase === 'Luteal' && (skinType === 'Oily' || skinType === 'Combination')) {
    return {
      timing: 'ease',
      why: 'Many people with acne break out more before a period — a good week to swap oils and heavy creams for an oil-free, non-comedogenic moisturiser.',
    };
  }
  return RULES[active][phase];
}

export function cautionsFor(active: ActiveId): string[] {
  return CAUTIONS[active] ?? [];
}

/**
 * Anything added in the last 14 days gets a proper patch-test instruction, in every phase. An
 * earlier version said "give it until your follicular phase to judge", which confused a 7–10 day
 * patch test with the 6–8 weeks a product takes to work, and could read as "keep going through a
 * reaction".
 */
export function newProductCaution(product: ShelfProduct, phase: Phase, today: string): string | null {
  const age = daysBetween(product.addedOn, today);
  if (age < 0 || age > 14) return null;
  const base =
    'New to you? Patch test before it goes on your face — your normal amount on the inside of your elbow, twice a day for 7–10 days. Redness, itching or swelling? Wash it off and don’t use it again. Once you’re using it, give it 6–8 weeks before judging. Prescribed? Follow your prescriber’s instructions.';
  if (phase === 'Menstrual' || phase === 'Luteal') {
    return `${base} Not started yet? Starting after your period can make a reaction easier to spot — but don’t delay a prescribed treatment.`;
  }
  return base;
}
