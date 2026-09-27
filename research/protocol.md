# Protocol: AI-assisted rapid review — facial skin across the menstrual cycle

**Written:** 27 Sep 2026, before any screening. Not externally registered.
**Directed by:** Sonali Krishnani (M.Sc. Microbiology). **Protocol drafted, and screening, extraction and GRADE ratings carried out, by AI agents (Claude).** No human second reviewer or independent expert was available; see *AI safeguards*.
**Method guidance:** Cochrane Rapid Reviews Methods Group interim guidance (Garritty et al., 2021); reported with a PRISMA 2020 flow diagram; certainty rated with GRADE.

## Questions
1. In healthy people who menstruate, do facial skin outcomes differ between phases of the menstrual cycle?
2. Has any study tested whether timing skincare to cycle phase improves skin, compared with a steady routine?

## Eligibility (PECO)
- **Population:** people with natural menstrual cycles (any age after menarche). Studies of acne patients are included for acne outcomes.
- **Exposure / comparison:** one cycle phase (or day range) compared with another, within the same people or between groups; or phase-timed skincare compared with a steady routine.
- **Outcomes:** acne (lesion counts or self-reported flares); sebum; skin barrier (TEWL); hydration; irritant or allergic reactivity; skin colour/redness; any other facial skin measure.
- **Designs:** any primary study with a phase comparison (cohort, cross-sectional, survey, crossover, trial). Reviews used only to find primary studies.
- **Exclude:** no phase comparison; only people on hormonal contraception or HRT with no natural-cycle group; animal or in-vitro only; skin temperature, blood flow, sweating or skin conductance as the only outcome (thermoregulation, not skin care); conference abstracts without data; not in English.

## Search (run 27 Sep 2026)
- **PubMed** (via the NCBI connector): `("menstrual cycle"[MeSH Terms] OR "menstrual cycle"[tiab] OR "luteal phase"[tiab] OR "follicular phase"[tiab] OR premenstrual[tiab] OR perimenstrual[tiab]) AND (acne[tiab] OR sebum[tiab] OR "transepidermal water loss"[tiab] OR "skin barrier"[tiab] OR "skin hydration"[tiab] OR "skin irritation"[tiab] OR "facial skin"[tiab] OR "skin color"[tiab] OR "skin colour"[tiab]) AND humans[MeSH Terms]`
- **ClinicalTrials.gov:** trials of skincare or acne treatment timed to menstrual cycle phase.
- **Consensus** (Semantic Scholar, Scopus): supplementary search on the same questions.
- **medRxiv:** preprints, where the connector allows (date/category search only).
- **Citation chasing:** reference lists of the 2024 scoping review (Nguyen et al.) and of included studies.

## Screening and extraction
- Two AI reviewers screen titles and abstracts **independently**, using the criteria above, without seeing each other's decisions.
- Disagreements go to a third AI adjudicator. Every decision and reason is logged in `screening.csv`.
- Full texts (or abstracts where full text isn't free) of included studies are extracted by two AI reviewers independently: design, n, population, phases compared, outcome, measure, result, main risk of bias. Differences are resolved against the source and logged.
- Planned: Sonali reviews the final table and the disagreement log. (Deviation: see item 5.)

## Certainty
GRADE per outcome: start **low** for observational designs; downgrade for risk of bias, inconsistency, indirectness (e.g. non-facial sites), imprecision (small n); report high / moderate / low / very low.

## AI safeguards
Two independent AI passes for screening and extraction; every claim traced to a record ID; all decisions published; no finding kept that no reviewer could trace to an opened source. This does not replace a human second reviewer, and the review says so.

## Deviations
Any change to this protocol after screening starts will be listed here with a reason.

1. **Screener independence partly compromised (27 Sep 2026).** Screeners A and B used a scratch file with the same name in a shared temporary folder. Each briefly saw about 10 of the other's lines, for the last records in the file (citation, Consensus and trial additions). Both report that their decisions for those records were already written and weren't changed, and each rebuilt its CSV from its own notes. Final files were checked: 484 unique ids each, matching the record set. Agreement is reported for all records, and this caveat applies to the late records.
2. **Consensus search capped at 3 results per query** by the connector's free tier, so that supplementary source isn't exhaustive.
3. **medRxiv/bioRxiv effectively unsearched:** the connector has no keyword search.
4. **Records in languages other than English (71) were excluded** as the protocol says; about 20 have relevant-looking titles (mostly older German sebum and acne papers). This is a known language-bias limitation.
5. **No human review of screening or extraction decisions.** Sonali approved publishing the findings and the app changes they led to, but did not check the individual screening or extraction decisions.
