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
 *   5. On 14 Sep 2026 four independent validation agents checked every sentence against sources
 *      they opened (AAD, NHS, HSE, DermNet, PubMed/PMC). Their corrections are applied here. Keep
 *      Irish users in mind: HSE advice and 112 / 999.
 *
 * Evidence labels, as shown to users:
 *   Good evidence            — trials or systematic reviews in people using it for this purpose
 *   Some evidence            — small or indirect trials (e.g. tested for a different condition)
 *   Dermatologist advice     — a clear AAD / NHS / HSE recommendation, without trials behind it
 *   Low risk, little evidence — common-sense advice with no trials
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

export type Evidence = 'Good evidence' | 'Some evidence' | 'Dermatologist advice' | 'Low risk, little evidence';

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
  why: 'UV reaches your skin all year, even on cloudy days. Outdoors, reapply about every 2 hours and after sweating. Look for 4 or 5 UVA stars.',
};

const GENTLE_CLEANSE: Pick = {
  short: 'Gentle cleanse',
  name: 'Gentle cleansing morning, night and after sweating',
  why: 'Fingertips and lukewarm water — never scrub.',
};

const GREEN_TEA: Remedy = {
  name: 'Cooled green tea compress',
  how: 'Steep a plain green tea bag in just-boiled water for 3–5 minutes, then let it cool completely. Soak a clean cloth in it and hold it on oily areas or spots for 5–10 minutes, away from your eyes. Make it fresh each time.',
  why: 'Green tea lotions reduced oil and spots in small trials. Brewed tea itself hasn’t been tested.',
  evidence: 'Low risk, little evidence',
  caution: 'Stop if it stings, itches or makes skin redder. Don’t use it on broken skin, or if tea has given you a rash before.',
};

export const PHASE_GUIDE: Record<Phase, PhaseGuide> = {
  Menstrual: {
    headline: 'Go gentle — skin may be a little more reactive around the start of your period.',
    tendency:
      'Oestrogen and progesterone are low. In a study of 29 women, a skin irritant caused a stronger reaction on day 1 of the cycle than on days 9–11, so skin may react to products more easily now.',
    hydrate: [
      {
        short: 'Glycerin serum',
        name: 'A glycerin or hyaluronic acid serum',
        why: 'These hold water in the skin’s outer layer. Apply to damp skin, then always follow with moisturiser — on their own, in dry air, they can leave skin drier.',
      },
      {
        short: 'Panthenol',
        name: 'Panthenol (vitamin B5)',
        why: 'In a controlled study, a panthenol cream helped skin repair faster and look less red after irritation from a detergent.',
      },
    ],
    moisturise: [
      {
        short: 'Ceramide cream',
        name: 'A ceramide moisturiser',
        why: 'Ceramides are key fats in the skin barrier. Dry skin: a richer cream. Oily skin: a light gel labelled non-comedogenic.',
      },
    ],
    goEasyOn: [
      {
        short: 'Anything new',
        name: 'Starting a new product',
        why: 'Skin may react more easily now, which makes a reaction harder to judge. If you can, start later in your cycle — and patch test first.',
      },
      {
        short: 'Stinging actives',
        name: 'Actives that sting — retinoids, acids, strong vitamin C',
        why: 'If your usual one stings or burns more than normal, pause it for a few nights, then restart every other night and build back up. Stop and ask a pharmacist if it keeps stinging. If it’s prescribed, check with your prescriber first.',
      },
      { short: 'Scrubs', name: 'Scrubs', why: 'Scrubbing irritates skin and can make breakouts worse.' },
    ],
    keepDoing: [SPF, GENTLE_CLEANSE],
    homeCare: [
      {
        name: 'Colloidal oatmeal soak',
        how: 'Stir colloidal oatmeal (extra-fine, skin-grade oats from a pharmacy) into lukewarm water. Soak dry or itchy skin for 10–15 minutes, pat dry, and moisturise within 3 minutes.',
        why: 'In lab tests, oat extracts calmed inflammation, and in small studies oat products eased dryness and itch.',
        evidence: 'Some evidence',
        caution: 'Most studies were in eczema. Skip it if you’re allergic to oats, and stop if it stings or a rash appears. Oats make the bath slippery — take care getting out.',
      },
      {
        name: 'Petroleum jelly over moisturiser',
        how: 'At night, apply moisturiser to damp skin, then a thin film of petroleum jelly on dry patches or lips.',
        why: 'It seals water in, and in a study with human volunteers it helped the skin barrier repair faster.',
        evidence: 'Some evidence',
        caution: 'If you’re acne-prone, keep it off your face — it may cause breakouts.',
      },
      {
        name: 'Cool compress',
        how: 'Run a clean cloth under cold water, wring it out, and hold it on itchy or irritated skin for 10–20 minutes, or until the itch eases. Moisturise afterwards.',
        why: 'Cooling soothes itch and irritation.',
        evidence: 'Dermatologist advice',
        caution: 'Cool water, not ice.',
      },
    ],
  },
  Follicular: {
    headline: 'Skin may be a little less reactive now — a handy time to start something new, if you want to.',
    tendency:
      'Oestrogen is rising. In one study of 29 women, skin reacted less to an irritant on days 9–11 than on day 1. Another study found skin lost a little less water just before ovulation than just before a period.',
    hydrate: [
      { short: 'Hyaluronic acid', name: 'A hyaluronic acid or glycerin serum', why: 'A simple serum under your moisturiser is enough for most skin.' },
      {
        short: 'Panthenol',
        name: 'Panthenol, if a new active dries you out',
        why: 'It may help. In a controlled study, a panthenol cream helped skin recover faster after detergent irritation — that study didn’t test retinoids or acids.',
      },
    ],
    moisturise: [
      { short: 'Your usual cream', name: 'Your usual ceramide moisturiser', why: 'It helps skin cope with drying actives if you start one.' },
      {
        short: 'Squalane',
        name: 'Squalane',
        why: 'A light oil that doesn’t go off easily. It’s often called non-clogging, but that hasn’t been properly tested in people. Oily or acne-prone skin: a gel moisturiser may suit you better.',
      },
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
        why: 'A retinoid, acid or vitamin C. Use retinoids at night only, starting every other night and building up slowly. Most products take at least 6 weeks to show results, and acne treatments often take 3 months or more — so it will run through every phase anyway. Very dry skin? Wait until it settles. Pregnant or trying to get pregnant? Don’t use a retinoid.',
      },
      {
        short: 'Strict SPF with acids',
        name: 'Be strict with sunscreen if you start an AHA',
        why: 'In a study reported by the FDA, 4 weeks of a glycolic acid (AHA) cream made skin 18% more sensitive to sunburn redness. Keep using sunscreen for a week after you stop.',
      },
    ],
    homeCare: [
      {
        name: 'Patch test anything new',
        how: 'Apply your normal amount to a coin-sized patch on the inside of your elbow, twice a day for 7–10 days. For wash-off products such as cleansers, leave it on for 5 minutes, then rinse. Use it on your face only if there’s no redness, itching or swelling.',
        why: 'It can show a reaction on a small patch before you put a product on your face.',
        evidence: 'Dermatologist advice',
        caution: 'Wash it off gently at the first sign of a reaction, and don’t use it again. Retinoids and acids can cause mild, short-lived stinging — if you’re unsure, ask a pharmacist. Blistering or a spreading rash: see a pharmacist or GP.',
      },
      {
        name: 'Gentle wash, morning and night, and after sweating',
        how: 'Use a mild cleanser and lukewarm water with your fingertips — no scrubbing.',
        why: 'Skin’s surface is naturally acidic. In one 3-month trial of 120 young people with mild acne, an acidic cleansing bar led to fewer inflamed spots than ordinary soap.',
        evidence: 'Some evidence',
        caution: 'Washing more often irritates skin and can cause more breakouts.',
      },
    ],
  },
  Ovulatory: {
    headline: 'Skin may hold water a little better around now — keep your routine simple.',
    tendency:
      'Oestrogen peaks just before ovulation. In a small study of 36 women, skin lost a little less water and held a little more at ovulation than a week later. Whether oil rises now or before your period is unclear — studies disagree.',
    hydrate: [
      {
        short: 'Light gel',
        name: 'A light glycerin or hyaluronic acid gel',
        why: 'A light gel is enough for most skin. If you feel dry, add your usual moisturiser.',
      },
    ],
    moisturise: [
      {
        short: 'Gel texture',
        name: 'A light moisturiser',
        why: 'Oily skin: a light, oil-free gel — silicone (dimethicone) textures feel less greasy. Dry skin: your usual cream.',
      },
    ],
    goEasyOn: [
      {
        short: 'Adding lots',
        name: 'Adding several new products at once',
        why: 'Using several new products at once can irritate skin, and you won’t know which one caused it.',
      },
    ],
    keepDoing: [SPF, GENTLE_CLEANSE],
    homeCare: [
      {
        name: 'Kaolin clay on an oily T-zone',
        how: 'Mix about 1 teaspoon of plain kaolin clay with water into a paste. Spread it thinly on your forehead, nose and chin, rinse after 5–10 minutes, then moisturise. Once or twice a week.',
        why: 'Clay soaks up surface oil. Only masks mixing clay with other ingredients have been tested, not plain clay.',
        evidence: 'Low risk, little evidence',
        caution: 'Skip broken or irritated skin and keep it away from your eyes. Patch test first, and rinse it off if it stings, itches or leaves skin feeling tight.',
      },
      GREEN_TEA,
    ],
  },
  Luteal: {
    headline: 'Many people with acne break out more before a period — keep things steady.',
    tendency:
      'Progesterone is high after ovulation, then both hormones fall before your period. In one small study, skin lost a little more water a week after ovulation than at ovulation. Among women with acne, spots often get worse just before or during a period — 44% to 65% in three studies — so plenty don’t notice a change.',
    hydrate: [
      { short: 'Oil-free gel', name: 'Glycerin or hyaluronic acid in an oil-free gel', why: 'Water without clogging pores.' },
      {
        short: 'Panthenol',
        name: 'Panthenol',
        why: 'In a study on deliberately irritated skin, it helped the barrier repair faster and reduced redness.',
      },
    ],
    moisturise: [
      {
        short: 'Non-clogging gel',
        name: 'An oil-free, non-comedogenic gel-cream',
        why: 'For oily or acne-prone skin. Dry skin: a ceramide cream.',
      },
    ],
    goEasyOn: [
      {
        short: 'Anything new',
        name: 'Starting anything new',
        why: 'If you break out this week, you won’t know whether it’s the new product or your cycle.',
      },
      { short: 'Face oils', name: 'Face oils and heavy creams on acne-prone skin', why: 'Greasy products can cause or worsen acne.' },
      {
        short: 'Extra spot treatments',
        name: 'Piling on benzoyl peroxide or salicylic acid',
        why: 'Both can dry or irritate skin, and irritated skin can break out more. Keep to your usual amount — and if it’s prescribed, use it as prescribed.',
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
        evidence: 'Dermatologist advice',
        caution: 'Use warm, not hot, water. Never squeeze a deep spot. If the skin around it turns hot or swollen, the redness spreads, or you feel unwell, get an urgent GP appointment. See a GP if it doesn’t settle or you keep getting deep, painful spots — they can scar.',
      },
      {
        name: 'Hydrocolloid spot patch',
        how: 'Clean and dry the skin, press a patch onto a spot that has a head or has opened, and wear it as the pack says.',
        why: 'It absorbs fluid, protects the spot and stops you picking. In a small trial of 20 people, patches reduced redness more than plain tape.',
        evidence: 'Some evidence',
        caution: 'Patches work best on spots near the surface — on a deep lump with no head they mainly protect it and stop you picking. Take it off and stop using them if the skin underneath itches or gets a rash.',
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
  { name: 'Baking soda', why: 'It’s alkaline, so it upsets skin’s natural acidity — which skin needs to repair its barrier and keep some bacteria in check.' },
  { name: 'Toothpaste on spots', why: 'Its abrasives, whitening agents and flavourings don’t fight acne and can irritate skin.' },
  { name: 'Undiluted essential oils, including tea tree', why: 'Neat oils can cause a lasting skin allergy — and old, oxidised oils are more likely to.' },
  { name: 'Apple cider vinegar', why: 'Its acetic acid has caused chemical burns, especially under a plaster.' },
  { name: 'Sugar or salt face scrubs', why: 'Scrubbing irritates skin and can make acne flare.' },
  { name: 'Rubbing alcohol or strong astringents', why: 'They dry skin out, and irritated skin is more likely to break out.' },
  { name: 'Hydrogen peroxide', why: 'It dries out and damages healing skin — dermatologists advise against it.' },
  { name: 'Raw garlic or cinnamon oil', why: 'Raw garlic has caused chemical burns, especially under a plaster. Cinnamon oil has caused a burn, and creams containing it have caused allergic rashes.' },
  { name: 'Covering any remedy with a plaster', why: 'The vinegar and garlic burns above both happened under a covering, which holds the ingredient against your skin.' },
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
    truth: 'A 2024 review found just 26 studies on how skin changes across the cycle. Most were small, and most measured skin temperature or blood flow. It didn’t look at acne or oil at all.',
  },
  {
    claim: 'Ovulation gives you a visible glow',
    truth: 'In a study of 22 women, facial redness rose slightly before ovulation, but not enough for anyone to see.',
  },
  {
    claim: 'Everyone breaks out before their period',
    truth: 'In three studies of women with acne, 44% to 65% got worse just before or during their period — so plenty don’t.',
  },
  {
    claim: 'Chin spots prove a hormone imbalance',
    truth: 'In one small study of 86 women with acne, chin spots weren’t linked to raised androgens (hormones like testosterone) on blood tests. Acne on the chest or back, or extra hair growth, were better clues.',
  },
  {
    claim: 'Switch products every phase — or try seed cycling',
    truth: 'No trials have tested switching routines by phase, and changing acne treatments too often can irritate skin and cause breakouts. Seed-cycling studies are few and small, most didn’t test the actual seed rotation, and results for acne were mixed.',
  },
];

export const SEE_SOMEONE: string[] = [
  'Skin that’s red, swollen, hot, painful and spreading — especially on your face or near your eye, or with a fever — contact a GP urgently.',
  'Thick, dark hair suddenly growing on your face or body, a deepening voice, or muscles getting bigger — ask your GP for an urgent appointment.',
  'Acne with irregular or missing periods, extra facial or body hair, thinning scalp hair, weight gain, or dark, thick patches on the neck or armpits — these can be signs of PCOS (polycystic ovary syndrome, now being renamed PMOS). See a GP.',
  'Deep, painful lumps under the skin, lots of spots, or spots leaving scars — see a GP. Treating these early helps prevent scarring.',
  'No better after 6–8 weeks of using a pharmacy acne treatment as directed, or acne getting you down — see a GP.',
  'Three missed periods in a row when you’re not pregnant, or bleeding between periods or after sex — see a GP.',
  'Blistering or a spreading rash after using something — wash it off and see a pharmacist or GP. If your lips, tongue or throat swell, breathing gets hard, or you feel faint, call 112 or 999.',
];

export const PREGNANCY_NOTE =
  'Pregnant or trying to be? Don’t use retinoids — retinol, retinal, adapalene, tretinoin, tazarotene or isotretinoin tablets — or hydroquinone. Spironolactone and antibiotics like doxycycline aren’t suitable in pregnancy either, so talk to your GP if you take them for acne. Azelaic acid is thought to be safe. Check with a pharmacist before using benzoyl peroxide or salicylic acid.';

export const BREASTFEEDING_NOTE =
  'Breastfeeding? Isotretinoin tablets and tetracycline antibiotics like doxycycline aren’t suitable. Ask a pharmacist before using a retinoid cream, and keep it off the nipple area.';

export const PILL_NOTE =
  'On the combined pill? It stops ovulation, so these phases may not match your skin. In one survey of women with acne, those on the pill had pre-period flares about as often as those who weren’t. The pill can also help acne.';

export const EVIDENCE_NOTE =
  'Your cycle can nudge your skin, but no study yet shows that switching products by phase beats a steady, gentle routine. Research on skin across the cycle is thin — mostly small studies that sometimes disagree. Treat these as timing tips, not rules.';

/** Every source here was opened by a research or validation agent, or by hand, on 13–14 Sep 2026. */
export const SOURCES: { label: string; url: string }[] = [
  { label: 'NHS — Fertility in the menstrual cycle', url: 'https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/' },
  { label: 'HSE — Periods', url: 'https://www2.hse.ie/conditions/periods-overview/' },
  { label: 'Review: skin across the menstrual cycle (2024)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11703644/' },
  { label: 'Skin irritation across the cycle (Agner, 1991)', url: 'https://pubmed.ncbi.nlm.nih.gov/2033132/' },
  { label: 'Skin barrier at ovulation vs a week later (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12206585/' },
  { label: 'Correction to the 2025 barrier study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12509239/' },
  { label: 'Premenstrual acne flares (Stoll et al., 2001)', url: 'https://pubmed.ncbi.nlm.nih.gov/11712049/' },
  { label: 'Inflamed spots before a period (Lucky, 2004)', url: 'https://pubmed.ncbi.nlm.nih.gov/15096370/' },
  { label: 'Acne around the period (Geller et al., 2014)', url: 'https://jcadonline.com/perimenstrual-flare-of-adult-acne/' },
  { label: 'Facial redness across the cycle (Burriss et al., 2015)', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0130093' },
  { label: 'Chin acne and androgens (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11921917/' },
  { label: 'Seed cycling — review (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12461132/' },
  { label: 'Panthenol and barrier repair (Proksch & Nissen, 2002)', url: 'https://pubmed.ncbi.nlm.nih.gov/19753737/' },
  { label: 'AAD — How to pick a moisturiser', url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer' },
  { label: 'AAD — Oily skin', url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/oily-skin' },
  { label: 'Dr Zoe Draelos — Moisturisers and silicones', url: 'https://www.zoedraelos.com/articles/moisturizers/' },
  { label: 'AAD — Face washing 101', url: 'https://www.aad.org/public/everyday-care/skin-care-basics/care/face-washing-101' },
  { label: 'AAD — Habits that make acne worse', url: 'https://www.aad.org/public/diseases/acne/skin-care/habits-stop' },
  { label: 'AAD — How to test skin care products', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/prevent-skin-problems/test-skin-care-products' },
  { label: 'AAD — Treating a deep, painful pimple', url: 'https://www.aad.org/public/diseases/acne/diy/treat-deep-painful-pimple' },
  { label: 'AAD — Petroleum jelly', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/routine/petroleum-jelly' },
  { label: 'AAD — Home itch relief for eczema (children)', url: 'https://www.aad.org/public/diseases/eczema/childhood/itch-relief/home-remedies' },
  { label: 'AAD — Skin care during pregnancy', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/routine/pregnancy-skin-care' },
  { label: 'AAD — Acne treatment in pregnancy', url: 'https://www.aad.org/public/diseases/acne/derm-treat/pregnancy' },
  { label: 'AAD — Adult acne treatment (toothpaste)', url: 'https://www.aad.org/public/diseases/acne/diy/adult-acne-treatment' },
  { label: 'AAD — Scars (hydrogen peroxide)', url: 'https://www.aad.org/public/diseases/a-z/scars-overview' },
  { label: 'FDA — Alpha hydroxy acids and sun sensitivity', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/alpha-hydroxy-acids' },
  { label: 'Hydrocolloid patches for acne (Chao et al., 2006)', url: 'https://pubmed.ncbi.nlm.nih.gov/16688374/' },
  { label: 'Hydrocolloid patches — review (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11856799/' },
  { label: 'Green tea for acne and oil — review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5384166/' },
  { label: 'Clay mask study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10626287/' },
  { label: 'Skin pH and cleansers — review', url: 'https://epub.ub.uni-muenchen.de/16348/1/10_1159_000094670.pdf' },
  { label: 'DermNet — Plant juice and sunlight burns', url: 'https://dermnetnz.org/topics/phytophotodermatitis' },
  { label: 'DermNet — Allergy to essential oils', url: 'https://dermnetnz.org/topics/allergic-contact-dermatitis-to-essential-oils' },
  { label: 'Vinegar chemical burn — case report', url: 'https://jcadonline.com/chemical-burn-from-vinegar-following-an-internet-based-protocol-for-self-removal-of-nevi/' },
  { label: 'Garlic burn — case report', url: 'https://pubmed.ncbi.nlm.nih.gov/24456964/' },
  { label: 'Cinnamon oil burn — case report', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5459757/' },
  { label: 'NHS — Acne', url: 'https://www.nhs.uk/conditions/acne/' },
  { label: 'HSE — Acne treatment', url: 'https://www2.hse.ie/conditions/acne/treatment/' },
  { label: 'NHS — Benzoyl peroxide', url: 'https://www.nhs.uk/medicines/benzoyl-peroxide/' },
  { label: 'DermNet — Salicylic acid', url: 'https://dermnetnz.org/topics/salicylic-acid' },
  { label: 'HSE — PCOS', url: 'https://www2.hse.ie/conditions/polycystic-ovary-syndrome/' },
  { label: 'NHS — PMOS, previously called PCOS', url: 'https://www.nhs.uk/conditions/polyendocrine-metabolic-ovarian-syndrome-pmos/' },
  { label: 'Endocrine Society — PCOS name change (2026)', url: 'https://www.endocrine.org/news-and-advocacy/news-room/2026/pcos-name-change' },
  { label: 'NHS — Hirsutism (excess hair)', url: 'https://www.nhs.uk/conditions/hirsutism/' },
  { label: 'NHS — Cellulitis', url: 'https://www.nhs.uk/conditions/cellulitis/' },
  { label: 'HSE — Cellulitis', url: 'https://www2.hse.ie/conditions/cellulitis/' },
  { label: 'HSE — Anaphylaxis', url: 'https://www2.hse.ie/conditions/anaphylaxis/' },
  { label: 'LactMed — Adapalene while breastfeeding', url: 'https://www.ncbi.nlm.nih.gov/books/NBK501423/' },
  { label: 'NHS — The combined pill', url: 'https://www.nhs.uk/contraception/methods-of-contraception/combined-pill/what-is-it/' },
  { label: 'StatPearls — The menstrual cycle', url: 'https://www.ncbi.nlm.nih.gov/books/NBK500020/' },
  { label: 'Skin barrier across the cycle (Harvell et al., 1992)', url: 'https://pubmed.ncbi.nlm.nih.gov/1493683/' },
  { label: 'StatPearls — Moisturisers and humectants', url: 'https://www.ncbi.nlm.nih.gov/books/NBK545171/' },
  { label: 'Petrolatum and skin barrier repair (Ghadially et al., 1992)', url: 'https://pubmed.ncbi.nlm.nih.gov/1564142/' },
  { label: 'Colloidal oat lotion for dry, itchy skin', url: 'https://pubmed.ncbi.nlm.nih.gov/23204849/' },
  { label: 'Squalane and oxidation', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10748031/' },
  { label: 'AAD — Sunscreen facts', url: 'https://www.aad.org/media/stats-sunscreen' },
  { label: 'NHS — Sunscreen and sun safety', url: 'https://www.nhs.uk/live-well/seasonal-health/sunscreen-and-sun-safety/' },
  { label: 'AAD — Retinoid or retinol?', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/retinoid-retinol' },
  { label: 'AAD — Getting the most from skin care products', url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/maximize-anti-aging-products' },
  { label: 'AAD — Tips to relieve dry skin', url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin' },
  { label: 'DermNet — Topical retinoids', url: 'https://dermnetnz.org/topics/topical-retinoids' },
  { label: 'NHS — Itchy skin', url: 'https://www.nhs.uk/symptoms/itchy-skin/' },
  { label: 'AAD — Hives self-care (cool compress)', url: 'https://www.aad.org/public/diseases/a-z/hives-self-care' },
];
