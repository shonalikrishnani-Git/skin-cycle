# Summary of findings: facial skin across the menstrual cycle

**Source:** `extract-final.csv` (47 studies, 64 study-by-outcome rows), reconciled from two independent AI extractions (`reconciliation.csv`). Written 27 Sep 2026.

**How to read the certainty ratings (GRADE).** Every study here is observational, so each outcome starts at **low**. It goes down one level for each serious problem: risk of bias (RoB), inconsistency, indirectness, imprecision or publication bias. **Very low** is the floor. Nothing was upgraded, because no outcome showed a large, consistent effect.

- **Low:** the true effect may be quite different from what the studies show.
- **Very low:** we have very little confidence in the finding.

Participant totals add up the number analysed for that outcome where a study reports it. "nr" means not reported.

## Q1: Does facial skin differ between cycle phases?

| Outcome | Studies (participants) | What the evidence shows | Certainty (reasons) | What it means for the app |
|---|---|---|---|---|
| **Acne: self-reported flares around the period** | 21 with data, plus 1 with no result reported (approx. 7,400 women) | In every study, many women with acne said their acne gets worse around their period. Median about 60% (range 12% to 98%). Where timing was asked, the week before was most common: 56% of those affected (Geller) and 58.5% (Arafa). | **Low** (not downgraded: the outcome is the self-report itself and the direction held across samples; the size varies widely) | OK to say: "Many people with acne notice flares in the week before their period." Not a rule for everyone. |
| **Acne: lesions counted by a clinician** | 3 (152) | Two small studies of women with acne found more inflamed spots before the period: 9.5 → 11.9 (+25%, p = 0.02, n = 25); papules 13.7 → 20.2 (p < 0.001, n = 32, flare-reporters). A study of 95 women with mild acne saw almost no difference (descriptive only). | **Very low** (RoB −1, indirectness −1: acne patients only, imprecision −1) | Supporting evidence only. Don't predict flares for a user. |
| **Sebum (oil)** | 7 (approx. 100; n nr in 4) | Conflicting. The best facial study (n = 51, 2 cycles) found no phase difference. | **Very low** (RoB −1, inconsistency −1, imprecision −1) | Not OK to say "oilier in phase X". |
| **Barrier (water loss, TEWL)** | 4 (36 with numbers) | Slightly more water loss after ovulation: 9.9 vs 8.9 g/h/m² (n = 36). Others: body sites, or site not stated. | **Very low** (RoB −1, indirectness −1, imprecision −1) | At most: "small studies hint at slightly more water loss after ovulation". |
| **Hydration** | 6 (approx. 150) | Conflicting: no difference (facial, n = 51), higher at ovulation (n = 36; corrected by erratum), driest days 1–6 (industry abstract). | **Very low** (RoB −1, inconsistency −1, imprecision −1) | No claims that skin is drier in a particular phase. |
| **Reactivity** | 5 (95 with numbers) | Mostly no difference. One study (n = 29) found a stronger irritant reaction on day 1 than days 9–11. | **Very low** (RoB −1, inconsistency −1, imprecision −1) | Not OK to say skin is "more sensitive" in a phase. Patch-test advice is fine. |
| **Colour and redness** | 3 (29 with results) | Redness varies, but by less than the eye can see (hormone-confirmed, n = 22). | **Very low** (imprecision −1, indirectness −1) | No visible-colour claims. |
| **Skin microbiome** | 3 (95 with numbers) | No phase difference in the sequencing studies. | **Very low** (RoB −1, indirectness −1, imprecision −1) | No microbiome claims. |
| **Other: pores, pH, UV sensitivity** | 5 (approx. 140) | One study found larger pores at ovulation; pH no change; one industry abstract on UV-B. | **Very low** | No phase claims. Everyday SPF advice stands. |

Not rated (not about facial skin care): hidradenitis suppurativa flares (3 studies), vulval acne (1), ear-wax lipids (1), forearm skin stretch (1).

## Q2: Does timing skincare to cycle phase beat a steady routine?

| Outcome | Studies (participants) | What the evidence shows | Certainty (reasons) | What it means for the app |
|---|---|---|---|---|
| **Phase-timed skincare vs a steady routine** | **0 direct studies.** 1 indirect (30). No registered trial. | The closest study gave glycolic peels to 3 groups of 10 at different cycle times; improvement was significant only within the days 10–14 group, and groups were never compared. | **Very low** (RoB −1, indirectness −1, imprecision −1) | Not OK to say skin needs different products by phase, or that cycle-syncing works. Phase notes are optional timing tips. |

## Answer to Q1

The one fairly consistent finding is about acne: many people with acne say it flares around their period, most often in the week before, and two small spot-count studies support it (about 25% more inflamed spots). For oil, hydration, barrier, sensitivity, colour and the skin microbiome, the studies are small, mostly abstract-only and conflicting. Where hormone-confirmed studies find changes, they are small and often too small to see.

## Answer to Q2

No study has tested whether timing skincare to the cycle works better than a steady routine, and no registered trial is doing so. The one related study (30 women, peel timing) cannot answer the question. Phase-based product switching is untested, which is not the same as shown to be harmful.

## Study-level counts (47 studies)

| Item | Count |
|---|---|
| Cycle phase confirmed by hormone tests | **4** (Mayrovitz 2007, Burriss 2015, Nikoletić 2025, Lau 2025) |
| Phase by self-reported dates or day counting | 33 |
| Phase method not stated | 10 |
| Hormonal contraception excluded | **3** (Burton 1973, Burriss 2015, Nikoletić 2025) |
| Read in full text / abstract only | **14 / 33** |
| Risk of bias per study (worst row) | **low 1 · some concerns 7 · high 39** |

## Reviewer judgement to check

Self-reported acne flares were kept at **low** rather than downgraded for recall bias, because the outcome is the self-report itself. Rated separately from clinician-counted lesions; combined, acne would be very low. Sonali to confirm.

## Limits

- Two AI extractors and an AI reconciler did this work; no human second reviewer.
- For Lucky 2004 and Berardesca 1989, full-text numbers come from one extractor only (they match each abstract).
- Most studies were read as abstracts; non-English studies excluded (about 20 relevant-looking German papers); only PubMed searched in full.
