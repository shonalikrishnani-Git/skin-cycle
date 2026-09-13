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

export type Timing = 'lean' | 'steady' | 'ease';

export interface TimingRule {
  timing: Timing;
  why: string;
}

const STING_MENSTRUAL = 'Can sting more while skin’s more reactive this week — use it less often and build back up.';
const TOLERATED_OVULATORY = 'Actives you already tolerate can carry on as usual this week.';
const STEADY_LUTEAL = 'Keep it steady rather than changing things up — harder to tell a reaction from a pre-period breakout.';

/**
 * active × phase → a timing nudge, each traceable to a line in PHASE_GUIDE. Where skin.ts says
 * nothing for a phase, the rule is "steady" with a neutral why, rather than inventing a reason.
 *
 * "Lean" means the guide recommends that ingredient for the phase — never "use more of an active".
 * Where the guide's advice depends on something the app can't see (a new product, a strong
 * vitamin C, whether it stings), the rule stays "steady" and the condition goes in the why.
 */
const RULES: Record<ActiveId, Record<Phase, TimingRule>> = {
  'hyaluronic-acid': {
    Menstrual: { timing: 'lean', why: 'Draws water into skin while it’s more reactive — pat onto damp skin, then seal in with moisturiser.' },
    Follicular: { timing: 'lean', why: 'Simple hydration is enough while your barrier is strong this week.' },
    Ovulatory: { timing: 'lean', why: 'Skin’s already holding water well — a light gel keeps layers simple.' },
    Luteal: { timing: 'lean', why: 'An oil-free gel adds water without clogging pores as breakouts get more likely.' },
  },
  glycerin: {
    Menstrual: { timing: 'lean', why: 'Draws water into skin while it’s more reactive — pat onto damp skin, then seal in with moisturiser.' },
    Follicular: { timing: 'lean', why: 'Simple hydration is enough while your barrier is strong this week.' },
    Ovulatory: { timing: 'lean', why: 'Skin’s already holding water well — a light gel keeps layers simple.' },
    Luteal: { timing: 'lean', why: 'An oil-free gel adds water without clogging pores as breakouts get more likely.' },
  },
  panthenol: {
    Menstrual: { timing: 'lean', why: 'Sped up barrier repair and reduced redness after irritation in a small controlled study.' },
    Follicular: { timing: 'steady', why: 'Only specifically called for if a new active is drying you out — keep it steady otherwise.' },
    Ovulatory: { timing: 'steady', why: 'Not singled out for this week — keep it steady if it’s already part of your routine.' },
    Luteal: { timing: 'lean', why: 'Calms skin as the barrier weakens before your period.' },
  },
  ceramides: {
    Menstrual: { timing: 'lean', why: 'A ceramide cream now — richer if you’re dry, an oil-free lotion if you’re oily.' },
    Follicular: { timing: 'steady', why: 'Barrier’s strong this week — keep your ceramide moisturiser going, especially if you start a new active.' },
    Ovulatory: { timing: 'steady', why: 'Not this week’s focus, but fine to keep steady, especially on drier skin.' },
    Luteal: { timing: 'lean', why: 'Water loss rises before your period — a ceramide cream helps as the barrier weakens.' },
  },
  squalane: {
    Menstrual: { timing: 'steady', why: 'Not specifically called out this week — keep it steady.' },
    Follicular: { timing: 'lean', why: 'Feels light and doesn’t clog pores — well suited to this steadier week.' },
    Ovulatory: { timing: 'steady', why: 'Not specifically called out this week — keep it steady, especially on oilier skin.' },
    Luteal: { timing: 'steady', why: 'Not specifically called out this week — keep it steady.' },
  },
  'petroleum-jelly': {
    Menstrual: { timing: 'lean', why: 'Sealed in water and helped barrier repair in a volunteer study — good on dry patches, but keep it off an acne-prone face.' },
    Follicular: { timing: 'steady', why: 'No specific timing tip for this week — keep it steady if it works for you.' },
    Ovulatory: { timing: 'steady', why: 'No specific timing tip for this week — keep it steady if it works for you.' },
    Luteal: { timing: 'steady', why: 'No specific timing tip for this week — keep it steady if it works for you.' },
  },
  retinoid: {
    Menstrual: { timing: 'ease', why: STING_MENSTRUAL },
    Follicular: { timing: 'steady', why: 'If it’s new, this is the sensible week to start it — every other night, one new active at a time. Already using it? Keep it steady.' },
    Ovulatory: { timing: 'steady', why: TOLERATED_OVULATORY },
    Luteal: { timing: 'steady', why: STEADY_LUTEAL },
  },
  aha: {
    Menstrual: { timing: 'ease', why: STING_MENSTRUAL },
    Follicular: { timing: 'steady', why: 'If it’s new, this is the sensible week to start it, one at a time — and be strict with sunscreen, since AHAs raise sun sensitivity. Already using it? Keep it steady.' },
    Ovulatory: { timing: 'steady', why: TOLERATED_OVULATORY },
    Luteal: { timing: 'steady', why: STEADY_LUTEAL },
  },
  bha: {
    Menstrual: { timing: 'ease', why: STING_MENSTRUAL },
    Follicular: { timing: 'steady', why: 'If it’s new, this is the sensible week to start it — one new active at a time. Already using it? Keep it steady.' },
    Ovulatory: { timing: 'steady', why: TOLERATED_OVULATORY },
    Luteal: { timing: 'steady', why: 'Keep to your usual amount — piling on more dries skin, and dry skin can lead to more oil and breakouts.' },
  },
  'benzoyl-peroxide': {
    Menstrual: { timing: 'steady', why: 'Not singled out as a stinging active this week — keep it steady.' },
    Follicular: { timing: 'steady', why: 'Not specifically called out this week — keep it steady.' },
    Ovulatory: { timing: 'steady', why: TOLERATED_OVULATORY },
    Luteal: { timing: 'steady', why: 'Keep to your usual amount — piling on more dries skin, and dry skin can lead to more oil and breakouts.' },
  },
  'vitamin-c': {
    Menstrual: { timing: 'steady', why: 'Keep it steady — but if a strong one stings this week, use it less often and build back up.' },
    Follicular: { timing: 'steady', why: 'If it’s new, this is the sensible week to start it — one new active at a time. Already using it? Keep it steady.' },
    Ovulatory: { timing: 'steady', why: 'Keep it steady — unless it’s stronger than 20%, which adds no extra benefit and may irritate.' },
    Luteal: { timing: 'steady', why: 'Not specifically called out this week — keep your usual vitamin C steady.' },
  },
  'azelaic-acid': {
    Menstrual: { timing: 'steady', why: 'No phase-specific caution for azelaic acid — keep it steady through your month.' },
    Follicular: { timing: 'steady', why: 'No phase-specific caution for azelaic acid — keep it steady through your month.' },
    Ovulatory: { timing: 'steady', why: 'No phase-specific caution for azelaic acid — keep it steady through your month.' },
    Luteal: { timing: 'steady', why: 'No phase-specific caution for azelaic acid — keep it steady through your month.' },
  },
  'face-oil-or-rich-cream': {
    Menstrual: { timing: 'steady', why: 'No specific caution this week — richer textures can suit dry patches now.' },
    Follicular: { timing: 'steady', why: 'Barrier’s strong and steady this week — keep your usual texture going.' },
    Ovulatory: { timing: 'steady', why: 'Skin’s holding water well — keep steady, though a lighter gel may suit an oily T-zone better.' },
    Luteal: { timing: 'ease', why: 'Greasy products can worsen acne on acne-prone skin — ease off this week when breakouts are more likely.' },
  },
  sunscreen: {
    Menstrual: { timing: 'lean', why: 'Every day, in every phase.' },
    Follicular: { timing: 'lean', why: 'Every day, in every phase — especially strict if you’ve started an AHA, which raises sun sensitivity.' },
    Ovulatory: { timing: 'lean', why: 'Every day, in every phase.' },
    Luteal: { timing: 'lean', why: 'Every day, in every phase.' },
  },
  none: {
    Menstrual: { timing: 'steady', why: 'No active picked — nothing here to lean into or ease off.' },
    Follicular: { timing: 'steady', why: 'No active picked — nothing here to lean into or ease off.' },
    Ovulatory: { timing: 'steady', why: 'No active picked — nothing here to lean into or ease off.' },
    Luteal: { timing: 'steady', why: 'No active picked — nothing here to lean into or ease off.' },
  },
};

export function timingFor(active: ActiveId, phase: Phase): TimingRule {
  return RULES[active][phase];
}

/**
 * A product added in the last 14 days lands in the app's two most reactive weeks (Menstrual,
 * Luteal) needing an extra nudge: a reaction is easier to read once skin has settled.
 */
export function newProductCaution(product: ShelfProduct, phase: Phase, today: string): string | null {
  if (phase !== 'Menstrual' && phase !== 'Luteal') return null;
  const age = daysBetween(product.addedOn, today);
  if (age < 0 || age > 14) return null;
  return 'Added recently — patch test first, and give it until your follicular phase to judge.';
}
