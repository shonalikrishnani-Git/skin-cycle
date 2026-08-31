/**
 * "I saw this everywhere — is it worth it, and is it for me?"
 *
 * The honest answer to a viral product isn't a star rating from a stranger. It's four things:
 * what the ingredient actually does, whether it can physically reach where it needs to, whether
 * it suits your skin, and whether this is the right week to start it.
 *
 * All of that can be answered offline, from biology you can check. No scraped reviews, nothing
 * that breaks when a retailer changes their website.
 *
 * Evidence ratings are deliberately conservative:
 *   strong   — long-standing dermatological use, repeatedly studied
 *   moderate — reasonable evidence, smaller or fewer studies
 *   limited  — popular, but the evidence is thin or mostly in-vitro
 */
import type { SkinType } from './advice';
import type { Phase } from './cycle';
import type { Depth } from './science';

export type Evidence = 'strong' | 'moderate' | 'limited';

export interface Active {
  id: string;
  name: string;
  aliases: string[];
  weight: string;
  depth: Depth;
  /** What it genuinely does, in plain words. */
  does: string;
  /** The claim it gets sold on that it doesn't actually deliver. */
  overclaim?: string;
  goodFor: string[];
  cautionFor: SkinType[];
  /** Actives harsh enough that the resilient follicular week is the sensible time to begin. */
  startInFollicular: boolean;
  evidence: Evidence;
}

export const ACTIVES: Active[] = [
  {
    id: 'azelaic',
    name: 'Azelaic acid',
    aliases: ['azelaic', 'azaleic', 'azelaic acid', 'skinoren', 'finacea'],
    weight: '188 Da',
    depth: 'through-barrier',
    does: 'Calms redness, eases breakouts and fades the dark marks they leave behind. Unusually gentle for how much it does, and one of the few actives generally considered safe in pregnancy.',
    goodFor: ['Breakouts', 'Redness', 'Dark marks', 'Rosacea-prone skin'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'retinol',
    name: 'Retinol',
    aliases: ['retinol', 'retinoid', 'vitamin a', 'retinal', 'retinaldehyde'],
    weight: '~286 Da',
    depth: 'through-barrier',
    does: 'Speeds up cell turnover and signals the cells in your dermis to build more collagen. The most evidenced anti-ageing ingredient there is — and the slowest, needing months, not weeks.',
    overclaim: 'It does not "resurface overnight". Early peeling is irritation, not results.',
    goodFor: ['Fine lines', 'Texture', 'Breakouts', 'Dark marks'],
    cautionFor: ['Sensitive', 'Dry'],
    startInFollicular: true,
    evidence: 'strong',
  },
  {
    id: 'niacinamide',
    name: 'Niacinamide',
    aliases: ['niacinamide', 'vitamin b3', 'nicotinamide'],
    weight: '122 Da',
    depth: 'through-barrier',
    does: 'Supports the skin barrier, helps regulate oil, and softens dark marks over time. Very well tolerated — the sensible first active for almost anyone.',
    goodFor: ['Oiliness', 'Barrier repair', 'Dark marks', 'Large-looking pores'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    aliases: ['vitamin c', 'vit c', 'ascorbic', 'l-ascorbic acid', 'ascorbic acid'],
    weight: '176 Da',
    depth: 'through-barrier',
    does: 'An antioxidant that also acts as a required cofactor for the enzymes that build collagen. It helps your skin make its own — which is the only way collagen actually increases.',
    overclaim: 'It supplies a cofactor. It does not supply collagen.',
    goodFor: ['Dullness', 'Dark marks', 'Sun protection support'],
    cautionFor: ['Sensitive'],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'salicylic',
    name: 'Salicylic acid',
    aliases: ['salicylic', 'bha', 'salicylic acid'],
    weight: '138 Da',
    depth: 'through-barrier',
    does: 'Oil-soluble, so it can travel down into a pore lined with sebum and clear it out. That solubility — not strength — is why it suits blackheads and congestion.',
    goodFor: ['Blackheads', 'Congestion', 'Oily skin'],
    cautionFor: ['Dry', 'Sensitive'],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'glycolic',
    name: 'Glycolic acid',
    aliases: ['glycolic', 'aha', 'glycolic acid'],
    weight: '76 Da',
    depth: 'through-barrier',
    does: 'The smallest of the exfoliating acids, so it penetrates most easily — which makes it effective and the most likely to sting. Loosens dead cells at the surface.',
    goodFor: ['Dullness', 'Texture', 'Uneven tone'],
    cautionFor: ['Sensitive', 'Dry'],
    startInFollicular: true,
    evidence: 'strong',
  },
  {
    id: 'lactic',
    name: 'Lactic acid',
    aliases: ['lactic', 'lactic acid'],
    weight: '90 Da',
    depth: 'through-barrier',
    does: 'A gentler exfoliating acid than glycolic, and hydrating alongside it. The better starting point if acids are new to you.',
    goodFor: ['Dullness', 'Dryness', 'Gentle exfoliation'],
    cautionFor: ['Sensitive'],
    startInFollicular: true,
    evidence: 'strong',
  },
  {
    id: 'benzoyl',
    name: 'Benzoyl peroxide',
    aliases: ['benzoyl', 'benzoyl peroxide', 'bp'],
    weight: '242 Da',
    depth: 'through-barrier',
    does: 'Kills acne bacteria directly, and they do not become resistant to it. Genuinely effective for inflamed spots — and it will bleach your towels and pillowcases.',
    goodFor: ['Inflamed spots', 'Acne'],
    cautionFor: ['Sensitive', 'Dry'],
    startInFollicular: true,
    evidence: 'strong',
  },
  {
    id: 'hyaluronic',
    name: 'Hyaluronic acid',
    aliases: ['hyaluronic', 'ha', 'hyaluronic acid', 'sodium hyaluronate'],
    weight: '5,000 – 1,000,000+ Da',
    depth: 'surface',
    does: 'Holds water. Large forms sit on the surface, smaller fragments reach the upper layers. Both hydrate — and in very dry air it can pull water out of your skin unless you seal it with a moisturiser on top.',
    overclaim: 'It does not "plump from within" or fill lines. It is a sponge, not a filler.',
    goodFor: ['Dehydration', 'Immediate softness'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'moderate',
  },
  {
    id: 'ceramides',
    name: 'Ceramides',
    aliases: ['ceramide', 'ceramides'],
    weight: '~500–850 Da',
    depth: 'surface',
    does: 'The lipids your barrier is already built from. Too large to travel deep — but the barrier is exactly where you want them, so that is not a flaw.',
    goodFor: ['Barrier repair', 'Dryness', 'Sensitivity'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'collagen',
    name: 'Collagen (topical)',
    aliases: ['collagen', 'marine collagen', 'collagen cream'],
    weight: '~300,000 Da',
    depth: 'blocked',
    does: 'Sits on the surface holding water, which softens the look of fine lines for a few hours.',
    overclaim: 'It cannot replace lost collagen. At ~300,000 Da it is roughly 600 times too large to cross your barrier, and your collagen is in the dermis beneath it.',
    goodFor: ['Surface hydration'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'limited',
  },
  {
    id: 'snail',
    name: 'Snail mucin',
    aliases: ['snail', 'snail mucin', 'mucin', 'secretion filtrate'],
    weight: 'Mixed, mostly large',
    depth: 'surface',
    does: 'A mix of glycoproteins and humectants that hydrates well and feels lovely. Popular for good reason as a moisturiser.',
    overclaim: 'Repair and regeneration claims rest mostly on lab-dish studies, not strong human trials.',
    goodFor: ['Hydration', 'Soothing'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'limited',
  },
  {
    id: 'centella',
    name: 'Centella / Cica',
    aliases: ['centella', 'cica', 'madecassoside', 'tiger grass'],
    weight: '~975 Da',
    depth: 'surface',
    does: 'Soothing, with reasonable evidence for calming irritated and reddened skin. A sensible partner to a strong active rather than an active itself.',
    goodFor: ['Redness', 'Irritation', 'Sensitivity'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'moderate',
  },
  {
    id: 'tranexamic',
    name: 'Tranexamic acid',
    aliases: ['tranexamic', 'tranexamic acid', 'txa'],
    weight: '157 Da',
    depth: 'through-barrier',
    does: 'Targets stubborn pigmentation, including melasma and the marks left by old breakouts. Slow, but well tolerated.',
    goodFor: ['Melasma', 'Dark marks', 'Uneven tone'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'moderate',
  },
  {
    id: 'zinc-oxide',
    name: 'Zinc oxide (sunscreen)',
    aliases: ['zinc oxide', 'mineral sunscreen', 'spf', 'sunscreen', 'titanium dioxide'],
    weight: 'Particle, not absorbed',
    depth: 'surface',
    does: 'Sits on top and scatters UV before it reaches your skin. Staying on the surface is the entire point — and daily use is the single highest-value habit in any routine.',
    goodFor: ['Sun protection', 'Preventing dark marks', 'Preventing ageing'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'strong',
  },
  {
    id: 'peptides',
    name: 'Peptides',
    aliases: ['peptide', 'peptides', 'matrixyl', 'argireline', 'copper peptide'],
    weight: '~500–5,000 Da',
    depth: 'surface',
    does: 'Short chains of amino acids meant to signal repair. Some are designed small or fat-soluble to help them cross.',
    overclaim: 'Most sit above the 500 Da limit, so how much gets in at all is genuinely uncertain. Treat "clinically proven" on a peptide label with care.',
    goodFor: ['Hydration', 'Supporting a routine'],
    cautionFor: [],
    startInFollicular: false,
    evidence: 'limited',
  },
];

// --- Matching a search to an active --------------------------------------------------

export function findActives(queryText: string): Active[] {
  const q = queryText.trim().toLowerCase();
  if (q.length < 2) return [];

  return ACTIVES.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.aliases.some((alias) => alias.includes(q) || q.includes(alias)) ||
      a.goodFor.some((g) => g.toLowerCase().includes(q)),
  );
}

// --- Is it right for you, right now? -------------------------------------------------

export type Fit = 'good' | 'caution' | 'wait';

export interface Verdict {
  fit: Fit;
  headline: string;
  reasons: string[];
}

export function judge(active: Active, skinType: SkinType, phase: Phase): Verdict {
  const reasons: string[] = [];

  if (active.depth === 'blocked') {
    reasons.push('It physically cannot reach the layer its main claim is about.');
  }

  const cautious = active.cautionFor.includes(skinType);
  if (cautious) {
    reasons.push(`It's a common source of irritation on ${skinType.toLowerCase()} skin — patch test, and build up slowly.`);
  }

  const badWeek = active.startInFollicular && (phase === 'Luteal' || phase === 'Menstrual');
  if (badWeek) {
    reasons.push(
      phase === 'Luteal'
        ? "You're in your luteal phase. If this reacts now, you won't be able to tell it apart from a hormonal breakout — start it after your period instead."
        : "You're in your menstrual phase and your barrier is at its most fragile. Wait until your follicular week.",
    );
  }

  if (active.evidence === 'limited') {
    reasons.push('The evidence here is thinner than the marketing suggests — fine to enjoy, not worth high hopes.');
  }

  if (active.depth === 'blocked') {
    return { fit: 'caution', headline: 'Nice to use — but not for what it claims', reasons };
  }
  if (badWeek) {
    return { fit: 'wait', headline: 'Good for you — but not this week', reasons };
  }
  if (cautious) {
    return { fit: 'caution', headline: 'Can work, but go carefully', reasons };
  }

  reasons.push(`Suits ${skinType.toLowerCase()} skin, and this is a fine week to use it.`);
  return { fit: 'good', headline: 'A sensible match for you', reasons };
}
