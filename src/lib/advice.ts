/**
 * The advice engine.
 *
 * Three things decide what your skin needs today: where you are in your cycle, what your skin
 * is normally like, and the air around you. This composes all three rather than picking one.
 *
 * Every tip carries a `why`. That is deliberate — advice you understand is advice you keep
 * doing, and it's what separates this from a list of product names.
 *
 * This is general skincare guidance, not medical advice. See DISCLAIMER below.
 */
import type { Phase } from './cycle';

export type SkinType = 'Normal' | 'Oily' | 'Dry' | 'Combination' | 'Sensitive';
export type ClimateId = 'sunny_humid' | 'cold_dry' | 'rainy' | 'indoor_ac';

export type Source = 'cycle' | 'skin' | 'climate';

export interface Tip {
  text: string;
  why: string;
  source: Source;
}

export interface Advice {
  headline: string;
  summary: string;
  focus: Tip[];
  skip: Tip[];
  hair: Tip[];
}

export const DISCLAIMER =
  'General guidance based on common skincare principles — not medical advice. ' +
  'Persistent or painful skin problems deserve a pharmacist or GP, not an app.';

export const SKIN_TYPES: { id: SkinType; label: string }[] = [
  { id: 'Normal', label: 'Normal' },
  { id: 'Oily', label: 'Oily' },
  { id: 'Dry', label: 'Dry' },
  { id: 'Combination', label: 'Combination' },
  { id: 'Sensitive', label: 'Sensitive' },
];

export const CLIMATES: { id: ClimateId; label: string; hint: string }[] = [
  { id: 'sunny_humid', label: 'Warm & humid', hint: 'Summer, sticky air' },
  { id: 'cold_dry', label: 'Cold & dry', hint: 'Winter, wind' },
  { id: 'rainy', label: 'Cool & wet', hint: 'Damp, high humidity' },
  { id: 'indoor_ac', label: 'Dry indoor air', hint: 'Office, A/C, heating' },
];

// --- What the cycle phase asks for -------------------------------------------------

const PHASE_RULES: Record<Phase, { summary: string; focus: Tip[]; skip: Tip[]; hair: Tip[] }> = {
  Menstrual: {
    summary: 'Your skin barrier is at its most fragile this week. Comfort beats correction.',
    focus: [
      {
        text: 'Gentle cleanser and a richer moisturiser',
        why: 'With both hormones low, skin loses water more easily and feels tight or flaky.',
        source: 'cycle',
      },
      {
        text: 'Look for ceramides or squalane',
        why: 'These rebuild the barrier rather than just sitting on top of it.',
        source: 'cycle',
      },
    ],
    skip: [
      {
        text: 'Strong acids, retinoids and scrubs',
        why: 'A compromised barrier stings and reddens easily. This week they cost more than they give.',
        source: 'cycle',
      },
    ],
    hair: [
      {
        text: 'Wash gently, go easy on heat',
        why: 'The scalp is more tender now, and tight styles can feel sore.',
        source: 'cycle',
      },
    ],
  },
  Follicular: {
    summary: 'Oestrogen is climbing and your skin is at its most resilient. This is your window.',
    focus: [
      {
        text: 'The best week to exfoliate or use actives',
        why: 'Rising oestrogen supports collagen and repair, so skin tolerates more and bounces back faster.',
        source: 'cycle',
      },
      {
        text: 'Vitamin C in the morning',
        why: 'Brightening work lands better while skin is robust and healing quickly.',
        source: 'cycle',
      },
    ],
    skip: [
      {
        text: 'Nothing much — but still introduce one new thing at a time',
        why: 'A good week can hide which product caused a reaction if you start three at once.',
        source: 'cycle',
      },
    ],
    hair: [
      {
        text: 'Good window for treatments or colour',
        why: 'Scalp sensitivity is at its lowest across the month.',
        source: 'cycle',
      },
    ],
  },
  Ovulatory: {
    summary: 'Oestrogen peaks. Skin usually looks its best — but oil is starting to rise.',
    focus: [
      {
        text: 'Lightweight hydration and daily SPF',
        why: 'Skin holds water well right now, so it needs less help and more protection.',
        source: 'cycle',
      },
      {
        text: 'Keep pores clear',
        why: 'Sebum is climbing towards the luteal peak. Staying ahead of it prevents next week.',
        source: 'cycle',
      },
    ],
    skip: [
      {
        text: 'Heavy occlusive creams',
        why: 'Layering rich products over rising oil is how congestion starts.',
        source: 'cycle',
      },
    ],
    hair: [
      {
        text: 'You may need to wash a day sooner',
        why: 'Scalp oil rises alongside skin oil.',
        source: 'cycle',
      },
    ],
  },
  Luteal: {
    summary: 'Progesterone rises, oil production goes up, and breakouts tend to arrive. Steady wins.',
    focus: [
      {
        text: 'Niacinamide, and salicylic acid on spots only',
        why: 'Progesterone drives sebum. These manage oil without stripping the whole face.',
        source: 'cycle',
      },
      {
        text: 'Keep the routine boring and consistent',
        why: 'Skin is both oilier and more reactive now — the worst week to experiment.',
        source: 'cycle',
      },
    ],
    skip: [
      {
        text: "Don't start anything new",
        why: 'A reaction this week is impossible to tell apart from a normal hormonal breakout.',
        source: 'cycle',
      },
      {
        text: 'Picking at congestion',
        why: 'Marks left now are slowest to fade, because skin is already inflamed.',
        source: 'cycle',
      },
    ],
    hair: [
      {
        text: 'A clarifying wash mid-week',
        why: 'Greasier roots are the scalp version of the same hormone shift.',
        source: 'cycle',
      },
    ],
  },
};

// --- What your skin type asks for --------------------------------------------------

const SKIN_RULES: Record<SkinType, { focus: Tip[]; skip: Tip[] }> = {
  Normal: {
    focus: [
      { text: 'Consistency over complexity', why: 'Skin that behaves does not need rescuing — it needs the same thing daily.', source: 'skin' },
    ],
    skip: [],
  },
  Oily: {
    focus: [
      { text: 'Gel or lotion textures, not creams', why: 'Hydration still matters; the weight of the product is what you change.', source: 'skin' },
    ],
    skip: [
      { text: 'Stripping your face until it squeaks', why: 'Oily skin that is over-cleansed produces more oil, not less.', source: 'skin' },
    ],
  },
  Dry: {
    focus: [
      { text: 'Layer a humectant under your moisturiser', why: 'Something to hold water, then something to stop it escaping. Order matters.', source: 'skin' },
    ],
    skip: [
      { text: 'Hot water and foaming cleansers', why: 'Both remove the oils dry skin cannot spare.', source: 'skin' },
    ],
  },
  Combination: {
    focus: [
      { text: 'Treat your face as two zones', why: 'A T-zone and cheeks rarely want the same product on the same day.', source: 'skin' },
    ],
    skip: [],
  },
  Sensitive: {
    focus: [
      { text: 'Fragrance-free, and patch test first', why: 'Fragrance is the most common trigger in reactive skin, and it hides in "natural" products too.', source: 'skin' },
      { text: 'Shorter routines', why: 'Fewer ingredients means fewer suspects when something goes wrong.', source: 'skin' },
    ],
    skip: [
      { text: 'Stacking multiple actives', why: 'Sensitive skin reacts to the combination even when each product is fine alone.', source: 'skin' },
    ],
  },
};

// --- What the air around you asks for ----------------------------------------------

const CLIMATE_RULES: Record<ClimateId, { focus: Tip[]; skip: Tip[]; hair: Tip[] }> = {
  sunny_humid: {
    focus: [
      { text: 'Reapply SPF through the day', why: 'One morning application does not survive sweat and hours of daylight.', source: 'climate' },
      { text: 'Cleanse properly in the evening', why: 'Sweat, sunscreen and dust make a film that water alone will not lift.', source: 'climate' },
    ],
    skip: [{ text: 'Rich night creams', why: 'Humid air means skin loses far less water overnight — heavy layers just sit there.', source: 'climate' }],
    hair: [{ text: 'Rinse the scalp more often', why: 'Sweat plus oil is what makes roots itch in humid weather.', source: 'climate' }],
  },
  cold_dry: {
    focus: [
      { text: 'Step up to a richer moisturiser', why: 'Cold outdoor air holds almost no moisture, so skin loses water fast.', source: 'climate' },
      { text: 'Lukewarm water, not hot', why: 'Hot showers feel wonderful and strip the barrier you are trying to protect.', source: 'climate' },
    ],
    skip: [{ text: 'Alcohol-heavy toners', why: 'They evaporate quickly and take your skin’s own moisture with them.', source: 'climate' }],
    hair: [{ text: 'Oil the ends, not the roots', why: 'Cold air makes lengths brittle while roots stay fine.', source: 'climate' }],
  },
  rainy: {
    focus: [
      { text: 'Lighter layers, but keep them', why: 'Damp air reduces water loss, so skin needs less product — not none.', source: 'climate' },
    ],
    skip: [{ text: 'Leaving hair damp for hours', why: 'A warm damp scalp is where flaking and itch begin.', source: 'climate' }],
    hair: [{ text: 'Dry the scalp properly', why: 'Same reason — damp roots, not damp lengths, cause the problem.', source: 'climate' }],
  },
  indoor_ac: {
    focus: [
      { text: 'Add a hydrating layer mid-day', why: 'Air conditioning and heating pull moisture out of the air, and then out of you.', source: 'climate' },
      { text: 'Still wear SPF indoors near windows', why: 'Glass blocks burning rays but not the ones that age skin.', source: 'climate' },
    ],
    skip: [{ text: 'Assuming indoors means safe', why: 'Eight hours in dry conditioned air is harsher than an hour outside.', source: 'climate' }],
    hair: [{ text: 'Watch for static and dry ends', why: 'Conditioned air dehydrates hair the same way it dehydrates skin.', source: 'climate' }],
  },
};

/** Compose today's advice from all three inputs. */
export function getAdvice(phase: Phase, skinType: SkinType, climate: ClimateId): Advice {
  const p = PHASE_RULES[phase];
  const s = SKIN_RULES[skinType];
  const c = CLIMATE_RULES[climate];

  return {
    headline: `${phase} phase · ${skinType.toLowerCase()} skin`,
    summary: p.summary,
    focus: [...p.focus, ...s.focus, ...c.focus],
    skip: [...p.skip, ...s.skip, ...c.skip],
    hair: [...p.hair, ...c.hair],
  };
}
