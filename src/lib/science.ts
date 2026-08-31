/**
 * The teaching layer.
 *
 * Every other part of this app tells you WHAT to do. This part explains WHY, using established
 * skin biology rather than whatever is trending.
 *
 * Rules for anything added here:
 *   1. It must be textbook biology or a published finding, not a brand claim.
 *   2. Where a number varies, say so — ranges are honest, single numbers usually aren't.
 *   3. It must change what a beginner actually does. Trivia doesn't earn a place.
 */

export interface SkinLayer {
  id: string;
  name: string;
  plain: string;
  detail: string;
}

/** Surface → deep. */
export const SKIN_LAYERS: SkinLayer[] = [
  {
    id: 'corneum',
    name: 'Stratum corneum',
    plain: 'The wall',
    detail:
      'Flattened dead cells packed in a lipid mortar — the "bricks and mortar" model. This is the layer that keeps water in and everything else out, and it is what every product you own has to get past first.',
  },
  {
    id: 'living-epidermis',
    name: 'Living epidermis',
    plain: 'The factory',
    detail:
      'Granulosum, spinosum and basale. New skin cells are made at the bottom and pushed upward, flattening and dying as they go, until they become the wall above. There is no blood supply here — it feeds by diffusion from below.',
  },
  {
    id: 'dermis',
    name: 'Dermis',
    plain: 'The scaffolding',
    detail:
      'Collagen and elastin, blood vessels, nerves, oil and sweat glands. Firmness and bounce live here — which matters, because it sits below the barrier that blocks most of what you apply.',
  },
  {
    id: 'hypodermis',
    name: 'Hypodermis',
    plain: 'The cushion',
    detail:
      'Fat and connective tissue. Insulation, padding and contour. No topical product reaches this layer.',
  },
];

export const LAYER_COUNT_NOTE =
  'You will often hear "five layers". That counts the strata of the epidermis — and only palms ' +
  'and soles have five. Everywhere else has four, because the stratum lucidum is unique to thick ' +
  'skin. Whole skin, top to bottom, is three layers: epidermis, dermis, hypodermis.';

export const TURNOVER_NOTE =
  'A new cell takes roughly 28–30 days to travel from the base to the surface in a young adult, ' +
  'and 45–50 in an older one — forearm studies land around 45–48 days. It varies by age and by ' +
  'where on the body you measure. This is why "nothing is happening" after one week is normal: ' +
  'you have not yet replaced the skin you are looking at.';

// --- How far things actually get ----------------------------------------------------

export type Depth = 'surface' | 'through-barrier' | 'blocked';

export interface Ingredient {
  name: string;
  weight: string;
  depth: Depth;
  note: string;
}

export const DALTON_RULE =
  'Molecules above about 500 daltons do not cross intact stratum corneum. It is a rule of thumb ' +
  'from transdermal drug research (Bos & Meinardi, 2000), not a hard wall — but it explains more ' +
  'skincare marketing than anything else you will read.';

/** Ordered smallest to largest, so the pattern speaks for itself. */
export const INGREDIENTS: Ingredient[] = [
  {
    name: 'Glycerin',
    weight: '~92 Da',
    depth: 'through-barrier',
    note: 'A humectant — pulls water toward the upper layers and holds it there. Cheap, and one of the best-evidenced ingredients there is.',
  },
  {
    name: 'Vitamin C (L-ascorbic acid)',
    weight: '~176 Da',
    depth: 'through-barrier',
    note: 'Antioxidant, and a required cofactor for the enzymes that build collagen. It supports your own collagen production rather than supplying collagen.',
  },
  {
    name: 'Salicylic acid',
    weight: '~138 Da',
    depth: 'through-barrier',
    note: 'Oil-soluble, so it can travel into a pore lined with sebum. That solubility, not strength, is why it suits congestion.',
  },
  {
    name: 'Niacinamide',
    weight: '~122 Da',
    depth: 'through-barrier',
    note: 'Well tolerated, and studied for barrier support and oil regulation. A sensible first active.',
  },
  {
    name: 'Retinol',
    weight: '~286 Da',
    depth: 'through-barrier',
    note: 'Crosses, then converts to retinoic acid, which signals the cells in the dermis to build more collagen. It instructs — it does not deliver.',
  },
  {
    name: 'Hyaluronic acid',
    weight: '~5,000 to 1,000,000+ Da',
    depth: 'surface',
    note: 'Not one ingredient. High molecular weight stays on the surface holding water; smaller fragments sit in the upper layers. Both hydrate — neither "fills" anything.',
  },
  {
    name: 'Collagen',
    weight: '~300,000 Da',
    depth: 'blocked',
    note: 'Around 600 times the size that can cross. Even hydrolysed peptides (1,000–10,000 Da) stay above the barrier. On skin it is a decent humectant — it is not a collagen delivery.',
  },
];

// --- The myths that cost beginners the most -----------------------------------------

export interface Myth {
  claim: string;
  verdict: string;
  because: string;
}

export const MYTHS: Myth[] = [
  {
    claim: 'Collagen cream replaces the collagen you have lost',
    verdict: 'It cannot',
    because:
      'Your collagen is in the dermis, under a barrier that stops molecules above ~500 Da. Collagen is ~300,000 Da. The cream hydrates the surface, which does soften the look of fine lines temporarily — but the collagen itself never arrives. What genuinely influences dermal collagen is signalling it (retinoids), supplying a cofactor (vitamin C), and not destroying it (daily sun protection).',
  },
  {
    claim: 'Natural means gentle',
    verdict: 'Unrelated',
    because:
      'Essential oils and botanical extracts are among the more common contact allergens, and fragrance — natural or synthetic — is a leading irritant. "Naturally derived" describes where a molecule came from, not how your skin will respond to it.',
  },
  {
    claim: 'If it tingles, it is working',
    verdict: 'Usually the opposite',
    because:
      'Stinging generally signals irritation or a disrupted barrier. A working product mostly feels like nothing. Persistent tingling is a reason to use something less often, not a sign of progress.',
  },
  {
    claim: 'Sunscreen is for sunny days',
    verdict: 'Year-round',
    because:
      'UVA levels stay far steadier across seasons than UVB, and UVA passes through window glass. Since sun exposure is the dominant driver of visible skin ageing, sunscreen is the single highest-value habit in any routine.',
  },
];

// --- Where a beginner should actually start -----------------------------------------

export interface Step {
  title: string;
  detail: string;
}

export const BEGINNER_STEPS: Step[] = [
  {
    title: 'Three products, not thirty',
    detail:
      'A gentle cleanser, a moisturiser, and a sunscreen for the morning. This covers cleaning, barrier support and protection — the only three jobs that matter before anything else.',
  },
  {
    title: 'Run it for four weeks before judging',
    detail:
      'You have not replaced a full layer of skin in less than a month. Changing products weekly means you never see what any of them do.',
  },
  {
    title: 'Then add ONE active',
    detail:
      'Niacinamide or vitamin C in the morning, or retinol at night — one of them, not all three. Two to four weeks apart. If something reacts, you will know exactly what.',
  },
  {
    title: 'Use your cycle as the calendar',
    detail:
      'Introduce anything new in your follicular phase, when skin is most resilient. Avoid starting in the luteal phase — a reaction then is impossible to tell apart from an ordinary hormonal breakout.',
  },
];

export const SOURCES: { label: string; url: string }[] = [
  {
    label: 'Bos & Meinardi (2000), The 500 Dalton rule — PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/10839713/',
  },
  {
    label: 'Epidermal turnover time — PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/7865480/',
  },
  {
    label: 'Layers of the skin — NCI SEER training',
    url: 'https://training.seer.cancer.gov/melanoma/anatomy/layers.html',
  },
  {
    label: 'Epidermis histology — StatPearls, NCBI',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK592423/',
  },
];
