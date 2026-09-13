/**
 * The skincare guidance — what this app is actually for.
 *
 * For each phase of the cycle: what skin tends to do, what to hydrate and moisturise with, what to
 * go easy on, and safe things to try at home. Plus the popular "remedies" that do more harm than
 * good, the cycle-and-skin claims that don't hold up, and when to see a pharmacist or GP.
 *
 * Rules for anything added here:
 *   1. Ingredient TYPES, never brands.
 *   2. Every home remedy carries an honest evidence level and a caution.
 *   3. Hedge what's hedged. Research on skin across the cycle is thin — small studies that sometimes
 *      disagree — and no trial shows phase-switching beats a steady routine. Say so.
 *   4. Nothing goes in without a source someone actually opened. Honey and aloe vera were cut on
 *      13 Sep 2026 because the evidence didn't hold up; ice for deep spots was replaced by the
 *      AAD's current warm-compress advice.
 */
import type { Phase } from './cycle';

export type SkinType = 'Normal' | 'Oily' | 'Dry' | 'Combination' | 'Sensitive';

export const SKIN_TYPES: { id: SkinType; hint: string }[] = [
  { id: 'Normal', hint: 'Rarely oily, rarely tight' },
  { id: 'Oily', hint: 'Shiny by midday' },
  { id: 'Dry', hint: 'Often tight or flaky' },
  { id: 'Combination', hint: 'Oily T-zone, drier cheeks' },
  { id: 'Sensitive', hint: 'Stings or reddens easily' },
];

export const SKIN_TYPE_TIP: Record<SkinType, string> = {
  Normal: 'A lotion is usually enough — keep the same simple routine most days.',
  Oily: 'Gel or oil-free, non-comedogenic textures — and still moisturise.',
  Dry: 'Creams hold more water than lotions. Look for ceramides; skip alcohol and fragrance.',
  Combination: 'Moisturise the dry areas; go light on, or skip, the oily ones.',
  Sensitive: 'Fragrance-free, fewer products used consistently, and patch test everything.',
};

export type Evidence = 'Good evidence' | 'Some evidence' | 'Low risk, little evidence';

export interface Pick {
  /** Two or three words, for the Today tiles. */
  short: string;
  name: string;
  why: string;
}

export interface Remedy {
  name: string;
  how: string;
  why: string;
  evidence: Evidence;
  caution: string;
}

export interface PhaseGuide {
  headline: string;
  tendency: string;
  hydrate: Pick[];
  moisturise: Pick[];
  goEasyOn: Pick[];
  keepDoing: Pick[];
  homeCare: Remedy[];
}

const SPF: Pick = {
  short: 'SPF 30+',
  name: 'Broad-spectrum SPF 30 or higher, every day',
  why: 'Every day, in every phase.',
};

const GENTLE_CLEANSE: Pick = {
  short: 'Gentle cleanse',
  name: 'Gentle cleansing morning, night and after sweating',
  why: 'Fingertips and lukewarm water — never scrub.',
};

const GREEN_TEA: Remedy = {
  name: 'Cooled green tea compress',
  how: 'Steep a plain green tea bag in just-boiled water for 3–5 minutes and chill it fully. Soak a clean cloth in it and hold it on oily or red areas for 5–10 minutes. Make it fresh each time.',
  why: 'Green tea lotions reduced oil and spots in small trials. Brewed tea itself hasn’t been tested.',
  evidence: 'Low risk, little evidence',
  caution: 'Stop if it stings.',
};

export const PHASE_GUIDE: Record<Phase, PhaseGuide> = {
  Menstrual: {
    headline: 'Go gentle — skin can be more reactive this week.',
    tendency:
      'Oestrogen and progesterone are at their lowest. In a small study, an irritant caused a stronger skin reaction on day 1 of the cycle than mid-cycle, so products may sting more easily now.',
    hydrate: [
      {
        short: 'Glycerin serum',
        name: 'A glycerin or hyaluronic acid serum',
        why: 'These draw water into the skin. Pat onto damp skin, then seal in with moisturiser.',
      },
      {
        short: 'Panthenol',
        name: 'Panthenol (vitamin B5)',
        why: 'In a small controlled study it sped up barrier repair and reduced redness after irritation.',
      },
    ],
    moisturise: [
      {
        short: 'Ceramide cream',
        name: 'A ceramide cream',
        why: 'Ceramides are key lipids in the skin barrier. Dry skin: a richer cream. Oily skin: an oil-free lotion.',
      },
    ],
    goEasyOn: [
      { short: 'Anything new', name: 'Starting a new product', why: 'Wait until skin is less reactive, so any reaction is easier to read.' },
      {
        short: 'Stinging actives',
        name: 'Actives that sting — retinoids, acids, strong vitamin C',
        why: 'If your usual one stings this week, use it less often and build back up.',
      },
      { short: 'Scrubs', name: 'Scrubs', why: 'Scrubbing irritates skin and can make breakouts worse.' },
    ],
    keepDoing: [SPF, GENTLE_CLEANSE],
    homeCare: [
      {
        name: 'Colloidal oatmeal soak',
        how: 'Stir colloidal oatmeal (extra-fine, skin-grade oats from a pharmacy) into lukewarm water. Soak dry or itchy skin for 10–15 minutes, pat dry, and moisturise within 3 minutes.',
        why: 'Oat compounds calm inflammation and help skin hold on to water.',
        evidence: 'Some evidence',
        caution: 'Most of the studies were in eczema. Skip it if you’re allergic to oats.',
      },
      {
        name: 'Petroleum jelly over moisturiser',
        how: 'At night, apply moisturiser to damp skin, then a thin film of petroleum jelly on dry patches or lips.',
        why: 'It seals water in, and in a volunteer study it helped the skin barrier repair faster.',
        evidence: 'Some evidence',
        caution: 'If you’re acne-prone, keep it off your face — it may cause breakouts.',
      },
      {
        name: 'Cool compress',
        how: 'Wet a clean cloth with cool water, wring it out, and hold it on itchy or irritated skin for 5–10 minutes. Moisturise afterwards.',
        why: 'Cooling soothes itch and irritation.',
        evidence: 'Low risk, little evidence',
        caution: 'Cool water, not ice.',
      },
    ],
  },
  Follicular: {
    headline: 'Often your steadiest skin — a good week to start something new.',
    tendency:
      'Oestrogen is rising. Small studies suggest skin reacts less now than at the start of your period, and the skin barrier is stronger before ovulation than before a period.',
    hydrate: [
      { short: 'Hyaluronic acid', name: 'A hyaluronic acid or glycerin serum', why: 'Simple is enough while your barrier is strong.' },
      {
        short: 'Panthenol',
        name: 'Panthenol, if a new active dries you out',
        why: 'It helps the barrier recover when a new product is drying.',
      },
    ],
    moisturise: [
      { short: 'Your usual cream', name: 'Your usual ceramide moisturiser', why: 'It helps skin cope with drying actives if you start one.' },
      { short: 'Squalane', name: 'Squalane', why: 'Feels light and doesn’t clog pores. Oily skin: a gel texture.' },
    ],
    goEasyOn: [
      {
        short: 'Several actives',
        name: 'Layering several new actives at once',
        why: 'If you start something, start just one — then you’ll know what it does.',
      },
    ],
    keepDoing: [
      SPF,
      {
        short: 'One new active',
        name: 'Introduce one new active, if you want to',
        why: 'A retinoid, acid or vitamin C — start retinoids every other night. Results take 6 weeks to 3 months, so it will run through every phase anyway.',
      },
      {
        short: 'Strict SPF with acids',
        name: 'Be strict with sunscreen if you start an AHA',
        why: 'After 4 weeks, AHAs made skin 18% more prone to sun redness. Keep protecting for a week after you stop.',
      },
    ],
    homeCare: [
      {
        name: 'Patch test anything new',
        how: 'Put a coin-sized amount on the inside of your elbow twice a day for 7–10 days. Use it on your face only if there’s no redness, itching or swelling.',
        why: 'It catches a reaction before it reaches your face.',
        evidence: 'Low risk, little evidence',
        caution: 'Wash it off at the first sign of a reaction, and don’t use it again.',
      },
      {
        name: 'Gentle wash, twice a day at most',
        how: 'Use a mild cleanser and lukewarm water with your fingertips — no scrubbing.',
        why: 'Skin’s surface is naturally acidic. In a 3-month trial of 120 people with acne, a mild acidic cleanser led to fewer inflamed spots than ordinary soap.',
        evidence: 'Some evidence',
        caution: 'Washing more often irritates skin and can cause more breakouts.',
      },
    ],
  },
  Ovulatory: {
    headline: 'Your skin barrier tends to be at its strongest — keep layers light.',
    tendency:
      'Oestrogen peaks. In a small study, skin lost less water and held more around ovulation than later in the cycle. Whether oil rises now or before your period is unclear — studies disagree.',
    hydrate: [
      {
        short: 'Light gel',
        name: 'A light glycerin or hyaluronic acid gel',
        why: 'Skin is already holding water well, so keep layers light.',
      },
    ],
    moisturise: [
      {
        short: 'Gel texture',
        name: 'A gel moisturiser',
        why: 'Oily skin: a gel, or skip the oily areas — silicone (dimethicone) textures suit oily skin. Dry skin: your usual cream.',
      },
    ],
    goEasyOn: [
      { short: 'Adding lots', name: 'Adding several products at once', why: 'Layering lots of new products at once is irritating.' },
      {
        short: 'Vitamin C over 20%',
        name: 'Vitamin C stronger than 20%',
        why: 'It adds no extra benefit and may irritate. Actives you already tolerate can carry on.',
      },
    ],
    keepDoing: [SPF, GENTLE_CLEANSE],
    homeCare: [
      {
        name: 'Kaolin clay on an oily T-zone',
        how: 'Mix about 1 teaspoon of plain kaolin clay with water into a paste. Spread it thinly on your forehead, nose and chin, rinse after 5–10 minutes, then moisturise. Once or twice a week.',
        why: 'Clay soaks up surface oil.',
        evidence: 'Low risk, little evidence',
        caution: 'It can dry skin — skip dry, broken or irritated areas, and patch test first.',
      },
      GREEN_TEA,
      {
        name: 'Rinse after sweating',
        how: 'After exercise, gently cleanse or rinse your face with lukewarm water and pat it dry.',
        why: 'Dermatologists recommend cleansing after sweating as part of a gentle routine.',
        evidence: 'Low risk, little evidence',
        caution: 'Pat dry — don’t rub.',
      },
    ],
  },
  Luteal: {
    headline: 'Breakouts are more likely before your period — keep things steady.',
    tendency:
      'Progesterone is high after ovulation, then both hormones fall before your period. Skin tends to lose more water, and among people with acne, flares in the week before a period are common — reported by roughly half (44–65% across studies).',
    hydrate: [
      { short: 'Oil-free gel', name: 'Glycerin or hyaluronic acid in an oil-free gel', why: 'Water without clogging pores.' },
      { short: 'Panthenol', name: 'Panthenol', why: 'Calms skin as the barrier weakens before your period.' },
    ],
    moisturise: [
      {
        short: 'Non-clogging gel',
        name: 'An oil-free, non-comedogenic gel-cream',
        why: 'For oily or acne-prone skin. Dry skin: a ceramide cream, as water loss rises.',
      },
    ],
    goEasyOn: [
      { short: 'Anything new', name: 'Starting anything new', why: 'A reaction this week is hard to tell apart from a pre-period breakout.' },
      { short: 'Face oils', name: 'Face oils and heavy creams on acne-prone skin', why: 'Greasy products can cause or worsen acne.' },
      {
        short: 'Extra spot treatments',
        name: 'Piling on benzoyl peroxide or salicylic acid',
        why: 'Both dry the skin, and dry skin can lead to more oil and breakouts. Keep your usual treatment steady.',
      },
    ],
    keepDoing: [
      SPF,
      { short: 'Blotting papers', name: 'Blotting papers instead of extra washing', why: 'They lift shine without the irritation of washing more.' },
      { short: 'Hands off', name: 'Leaving spots alone', why: 'Squeezing raises the risk of infection, dark marks and scarring.' },
    ],
    homeCare: [
      {
        name: 'Warm compress on a deep, sore spot',
        how: 'Soak a clean washcloth in warm water, wring it out, and hold it on the spot for 10–15 minutes, three times a day. Use a fresh cloth each time.',
        why: 'It’s what the American Academy of Dermatology recommends for deep, painful pimples.',
        evidence: 'Low risk, little evidence',
        caution: 'Never squeeze a deep spot. See a doctor if it doesn’t settle, or if you get several.',
      },
      {
        name: 'Hydrocolloid spot patch',
        how: 'Clean and dry the skin, press a patch onto a spot that has a head or has opened, and wear it as the pack says.',
        why: 'It absorbs fluid, protects the spot and stops you picking. In a small trial, patches reduced redness more than plain tape.',
        evidence: 'Some evidence',
        caution: 'Patches do little for deep lumps with no head.',
      },
    ],
  },
};

export interface Warning {
  name: string;
  why: string;
}

export const DONT_TRY: Warning[] = [
  { name: 'Lemon or lime juice', why: 'Contains psoralens, which react with sunlight and can cause burn-like blisters and dark streaks.' },
  { name: 'Baking soda', why: 'It’s alkaline. Raising skin’s natural acidity disrupts barrier repair and helps bacteria grow.' },
  { name: 'Toothpaste on spots', why: 'Its abrasives, whitening agents and flavourings don’t fight acne and can irritate skin.' },
  { name: 'Undiluted essential oils, including tea tree', why: 'Neat oils can cause a lasting skin allergy — and old, oxidised oils are more likely to.' },
  { name: 'Neat apple cider vinegar', why: 'Its acetic acid has caused chemical burns, especially under a plaster.' },
  { name: 'Sugar or salt face scrubs', why: 'Scrubbing irritates skin and can make acne flare.' },
  { name: 'Hydrogen peroxide', why: 'It dries out and damages healing skin — dermatologists advise against it.' },
  { name: 'Garlic or cinnamon', why: 'Both have caused chemical burns on skin, and cinnamon also causes allergic rashes.' },
];

export interface Myth {
  claim: string;
  truth: string;
}

export const MYTHS: Myth[] = [
  {
    claim: 'Everyone has a 28-day cycle and ovulates on day 14',
    truth: 'Normal cycles run 21–35 days, and ovulation usually comes 10–16 days before the next period. That’s why this app works from your own dates.',
  },
  {
    claim: 'Science has mapped what skin does each week',
    truth: 'A 2024 review found only 26 small studies, mostly on skin temperature and blood flow — very little on acne or oil by phase.',
  },
  { claim: 'Ovulation gives you a visible glow', truth: 'Facial redness rises slightly, but not enough for the eye to see.' },
  { claim: 'Everyone breaks out before their period', truth: 'Roughly half of women with acne do (44–65% across studies) — so many don’t.' },
  {
    claim: 'Chin or jawline spots prove a hormone imbalance',
    truth: 'One study found no link to raised androgens. Acne on the chest or back, or extra hair growth, were better clues.',
  },
  {
    claim: 'Switch products every phase — or try seed cycling',
    truth: 'No trials test phase-switching routines, and swapping acne treatments too often makes acne worse. Seed-cycling studies are small, with mixed results.',
  },
];

export const SEE_SOMEONE: string[] = [
  'Acne with irregular or missing periods, extra facial or body hair, thinning scalp hair, weight gain, or dark, thick patches on the neck or armpits — these can point to PCOS (now called PMOS by the NHS). See a GP.',
  'Extra hair appearing within a few months, especially with a deeper voice — see a GP promptly.',
  'Deep, painful lumps under the skin, or early scarring — see a GP.',
  'Pharmacy treatment not helping after 6–8 weeks, or acne making you very unhappy — try a pharmacist, then a GP.',
  'Three missed periods in a row when you’re not pregnant, or bleeding between periods or after sex — see a GP.',
  'Blistering or a spreading rash after using something — wash it off and see a pharmacist or GP. If your lips, tongue or throat swell, or breathing gets hard, call 112 or 999.',
];

export const PREGNANCY_NOTE =
  'Pregnant or trying to be? Avoid retinoids (retinol, retinal, adapalene, tretinoin, tazarotene) and hydroquinone — azelaic acid is generally considered a safe alternative. Breastfeeding? Check with a pharmacist before using a retinoid.';

export const PILL_NOTE =
  'On the combined pill? It stops ovulation, so these phases may not match your skin — although in one survey, pill users reported pre-period breakouts as often as non-users.';

export const EVIDENCE_NOTE =
  'Your cycle can nudge your skin, but no study yet shows that switching products by phase beats a steady, gentle routine. Research on skin across the cycle is thin — mostly small studies that sometimes disagree. Treat these as timing tips, not rules.';

/** Every source here was opened by a research agent or by hand on 13–14 Sep 2026. */
export const SOURCES: { label: string; url: string }[] = [
  { label: 'NHS — Fertility in the menstrual cycle', url: 'https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/' },
  { label: 'Review: skin across the menstrual cycle (2024)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11703644/' },
  { label: 'Skin irritation across the cycle (Agner, 1991)', url: 'https://pubmed.ncbi.nlm.nih.gov/2033132/' },
  { label: 'Skin barrier across the cycle — corrected (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12509239/' },
  { label: 'Premenstrual acne flares (Stoll et al., 2001)', url: 'https://pubmed.ncbi.nlm.nih.gov/11712049/' },
  { label: 'Panthenol and barrier repair', url: 'https://pubmed.ncbi.nlm.nih.gov/19753737/' },
  { label: 'AAD — How to pick a moisturiser', url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer' },
  { label: 'AAD — Habits that make acne worse', url: 'https://www.aad.org/public/diseases/acne/skin-care/habits-stop' },
  { label: 'AAD — Patch testing skin care products', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/prevent-skin-problems/test-skin-care-products' },
  { label: 'AAD — Treating a deep, painful pimple', url: 'https://www.aad.org/public/diseases/acne/diy/treat-deep-painful-pimple' },
  { label: 'AAD — Petroleum jelly', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/routine/petroleum-jelly' },
  { label: 'AAD — Oatmeal baths for itchy skin', url: 'https://www.aad.org/public/diseases/eczema/childhood/itch-relief/home-remedies' },
  { label: 'AAD — Skin care during pregnancy', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/routine/pregnancy-skin-care' },
  { label: 'FDA — Alpha hydroxy acids and sun sensitivity', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/alpha-hydroxy-acids' },
  { label: 'Hydrocolloid patches for acne (2006 trial)', url: 'https://pubmed.ncbi.nlm.nih.gov/16688374/' },
  { label: 'Green tea for acne and oil — review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5384166/' },
  { label: 'Skin pH and cleansers — review', url: 'https://epub.ub.uni-muenchen.de/16348/1/10_1159_000094670.pdf' },
  { label: 'DermNet — Lemon and sunlight burns', url: 'https://dermnetnz.org/topics/lemon' },
  { label: 'DermNet — Allergy to essential oils', url: 'https://dermnetnz.org/topics/allergic-contact-dermatitis-to-essential-oils' },
  { label: 'NHS — Acne', url: 'https://www.nhs.uk/conditions/acne/' },
  { label: 'NHS — PCOS, now called PMOS', url: 'https://www.nhs.uk/conditions/polyendocrine-metabolic-ovarian-syndrome-pmos/' },
  { label: 'NHS — The combined pill', url: 'https://www.nhs.uk/contraception/methods-of-contraception/combined-pill/what-is-it/' },
];
