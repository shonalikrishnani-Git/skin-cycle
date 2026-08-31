/**
 * Reading an ingredients label.
 *
 * DELIBERATELY NOT A TOXICITY SCORE. Apps that rate ingredients "toxic" or "clean" — Yuka,
 * Think Dirty, EWG Skin Deep — are widely rejected by dermatologists and cosmetic chemists,
 * because toxicity is dose- and route-dependent and a list of names carries neither. Rating a
 * product from its ingredient list is, as one chemist put it, like rating a meal's taste from
 * its recipe.
 *
 * So this flags three things that are actually checkable:
 *   1. actives we can explain,
 *   2. known contact allergens — flagged as relevant to YOU, not as poison,
 *   3. genuine regulatory limits, which really do differ by region.
 *
 * If something can't be established from the label alone, it isn't flagged.
 */
import type { SkinType } from './advice';
import { ACTIVES, matchesAlias, type Active } from './actives';

export type FlagKind = 'allergen' | 'regulatory' | 'drying' | 'note';

export interface Flag {
  kind: FlagKind;
  matched: string;
  title: string;
  detail: string;
  /** Only surfaced prominently for these skin types; everyone still sees it listed. */
  mattersMostTo?: SkinType[];
}

interface FlagRule {
  patterns: string[];
  kind: FlagKind;
  title: string;
  detail: string;
  mattersMostTo?: SkinType[];
}

const FLAG_RULES: FlagRule[] = [
  {
    patterns: ['parfum', 'fragrance', 'aroma'],
    kind: 'allergen',
    title: 'Fragrance',
    detail:
      'The most common cause of contact allergy in cosmetics. Not dangerous to most people — but if your skin reacts to things and you never know why, this is the first thing to rule out.',
    mattersMostTo: ['Sensitive', 'Dry'],
  },
  {
    patterns: ['linalool', 'limonene', 'citronellol', 'geraniol', 'eugenol', 'coumarin', 'citral', 'farnesol'],
    kind: 'allergen',
    title: 'Named fragrance allergen',
    detail:
      'The EU requires these to be named on the label precisely because they are established allergens. Seeing one is not a red flag — it is the label doing its job.',
    mattersMostTo: ['Sensitive'],
  },
  {
    patterns: ['lavandula', 'melaleuca', 'tea tree', 'mentha', 'eucalyptus', 'citrus', 'rosmarinus'],
    kind: 'allergen',
    title: 'Essential oil',
    detail:
      'Plant-derived, and among the more frequent irritants and allergens in skincare. "Natural" describes where it came from, not how your skin will take it.',
    mattersMostTo: ['Sensitive'],
  },
  {
    patterns: ['alcohol denat', 'denatured alcohol', 'sd alcohol'],
    kind: 'drying',
    title: 'Drying alcohol',
    detail:
      'Makes a product feel light and evaporate fast. Fine on oily skin, often not on dry or compromised skin. Position in the list matters — near the end it is a minor component.',
    mattersMostTo: ['Dry', 'Sensitive'],
  },
  {
    patterns: ['retinol', 'retinyl palmitate', 'retinyl acetate'],
    kind: 'regulatory',
    title: 'Retinol — EU concentration limits apply',
    detail:
      'Under Commission Regulation (EU) 2024/996, retinol and its esters are capped at 0.05% retinol equivalent in body lotions and 0.3% in other leave-on and rinse-off products, in force for new products since 1 November 2025, with a transition period for stock already on shelves. Products must also carry: "Contains vitamin A. Consider your daily intake before use." A product bought outside the EU may legally contain more.',
  },
  {
    patterns: ['methylisothiazolinone', 'methylchloroisothiazolinone'],
    kind: 'regulatory',
    title: 'Preservative with EU restrictions',
    detail:
      'Restricted in the EU after a rise in contact allergy — banned in leave-on products, limited in rinse-off. Its presence in a rinse-off product is legal and within limits.',
    mattersMostTo: ['Sensitive'],
  },
  {
    patterns: ['hydroquinone'],
    kind: 'regulatory',
    title: 'Not permitted in EU cosmetics',
    detail:
      'Banned in general cosmetic products in the EU, though prescribed medically in some countries and sold over the counter in others. If you bought this abroad or online, that is worth knowing — and worth a pharmacist\'s view.',
  },
];

export interface LabelReading {
  total: number;
  actives: { active: Active; position: number }[];
  flags: Flag[];
  unrecognised: number;
}

/** Ingredient lists are comma-separated INCI names; people paste them with all sorts of noise. */
export function parseLabel(raw: string): string[] {
  return raw
    .replace(/\s*\n\s*/g, ', ')
    .split(',')
    .map((s) => s.replace(/\(.*?\)/g, '').replace(/[.*•·]/g, '').trim().toLowerCase())
    .filter((s) => s.length > 1);
}

export function readLabel(raw: string): LabelReading {
  const items = parseLabel(raw);
  const actives: { active: Active; position: number }[] = [];
  const flags: Flag[] = [];
  const seenFlags = new Set<string>();
  const claimed = new Set<number>();

  items.forEach((item, i) => {
    const active = ACTIVES.find(
      (a) =>
        a.aliases.some((alias) => matchesAlias(item, alias)) ||
        item.includes(a.name.toLowerCase()),
    );
    if (active && !actives.some((x) => x.active.id === active.id)) {
      actives.push({ active, position: i + 1 });
      claimed.add(i);
    }

    FLAG_RULES.forEach((rule) => {
      const hit = rule.patterns.find((p) => item.includes(p));
      if (hit && !seenFlags.has(rule.title)) {
        seenFlags.add(rule.title);
        claimed.add(i);
        flags.push({
          kind: rule.kind,
          matched: item,
          title: rule.title,
          detail: rule.detail,
          mattersMostTo: rule.mattersMostTo,
        });
      }
    });
  });

  return {
    total: items.length,
    actives,
    flags,
    unrecognised: items.length - claimed.size,
  };
}

export const ORDER_NOTE =
  'Ingredients are listed in descending order of concentration down to 1%; below that they can ' +
  'appear in any order. So something near the top is doing most of the work, and something near ' +
  'the bottom is present in a tiny amount — which is exactly the context a "toxic ingredient" ' +
  'score throws away.';

export const NO_SCORE_NOTE =
  'There is no safety score here on purpose. Whether an ingredient causes a problem depends on ' +
  'how much of it there is and what it is mixed with — neither of which a list of names tells ' +
  'you. Apps that grade products "clean" or "toxic" from the label alone are rejected by ' +
  'dermatologists and cosmetic chemists for that reason.';
