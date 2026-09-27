# Search log: facial skin across the menstrual cycle

**Date run:** 27 Sep 2026
**Run by:** AI search agent (Claude), following `protocol.md`
**Output:** `records.jsonl` (484 unique records, one JSON object per line)
**Screening:** none done at this step. All records go to title/abstract screening, except that the registry results were narrowed at title level (see section 2).

## Summary for the PRISMA flow diagram

| Source | Records retrieved | Duplicates removed | New unique records added |
|---|---|---|---|
| PubMed (database) | 473 | 0 | **473** |
| ClinicalTrials.gov (register) | 207 unique trials across 6 searches (319 hits including overlaps); 2 judged plausibly relevant at title level | 0 | **2** |
| Consensus (database, supplementary) | 9 (3 per search × 3 searches) | 6 (already in PubMed set) | **3** |
| medRxiv (preprints) | 30 scanned, 0 relevant | n/a | **0** |
| Citation chasing (other methods) | 6 studies from the Nguyen 2024 reference list + 7 named known studies = 13 | 7 (already in PubMed set) | **6** |
| **Total** | | **13** | **484** |

PRISMA 2020 wording:
- Records identified from databases: **482** (PubMed 473 + Consensus 9).
- Records identified from registers: **2** (ClinicalTrials.gov, after title-level relevance narrowing of 207 unique hits).
- Duplicates removed before screening: **6** (all Consensus hits that were already in PubMed).
- Records identified via other methods (citation chasing): **13** candidates. **7** were already in the database set, so **6** new records were added.
- **Records going to title/abstract screening: 484** (473 + 2 + 3 + 6).

Deduplication used PMID first, then DOI, then normalised title (lower case, punctuation removed). After dedupe there were 0 duplicate IDs, 0 duplicate DOIs and 0 duplicate titles in `records.jsonl`.

## 1. PubMed

- **Tool:** NCBI connector (`pubmed.search_articles`, `pubmed.get_article_metadata`)
- **Exact query (from protocol):**
  ```
  ("menstrual cycle"[MeSH Terms] OR "menstrual cycle"[tiab] OR "luteal phase"[tiab] OR "follicular phase"[tiab] OR premenstrual[tiab] OR perimenstrual[tiab]) AND (acne[tiab] OR sebum[tiab] OR "transepidermal water loss"[tiab] OR "skin barrier"[tiab] OR "skin hydration"[tiab] OR "skin irritation"[tiab] OR "facial skin"[tiab] OR "skin color"[tiab] OR "skin colour"[tiab]) AND humans[MeSH Terms]
  ```
- **No date or language limits.**
- **Total count returned: 473.** This matches the 473 verified earlier on 27 Sep 2026.
- **PMIDs retrieved:** 473 of 473 (pages retstart 0/200/400, max_results 200; the connector caps pages at 200). All 473 are unique.
- **Metadata:** fetched for all 473 PMIDs with `get_article_metadata`, in 24 batches of 20 (the connector returns at most 20 per call). Coverage was 473/473, with none missing.
- **Set profile:** publication years 1954 to 2026. 402 records are in English and 71 are not (ger 25, fre 12, ita 8, chi 5, pol 5, cze 4, spa 3, jpn 2, rus 2, and 1 each of hun, por, bul, dut, swe). 64 have no abstract in PubMed. Each record has a `language` field so screeners can apply the protocol's English-only rule.

## 2. ClinicalTrials.gov

- **Tool:** c-trials connector (`search_trials`, `get_trial_details`; ClinicalTrials.gov API v2)

| # | Parameters | Hits |
|---|---|---|
| S1 | condition = `acne AND ("menstrual cycle" OR premenstrual OR perimenstrual OR "luteal phase" OR "follicular phase")` | 3 |
| S2 | condition = `acne`; intervention = `"menstrual cycle" OR "cycle phase" OR premenstrual OR perimenstrual` | 3 |
| S3 | advanced (full text) = `(skin OR skincare OR "skin care" OR sebum OR "transepidermal water loss" OR "skin barrier" OR "skin hydration") AND ("menstrual cycle" OR "cycle phase" OR "luteal phase" OR "follicular phase" OR premenstrual OR perimenstrual)` | 201 (3 pages) |
| S4 | condition = `skin OR acne OR sebum OR seborrhea OR rosacea OR "skin sensitivity"`; advanced = `("menstrual cycle" OR "cycle phase" OR "luteal phase" OR "follicular phase" OR premenstrual OR perimenstrual OR catamenial)` | 81 |
| S5 | condition = `"premenstrual syndrome" OR premenstrual`; intervention = `skin OR skincare OR cream OR topical OR serum OR moisturizer OR cosmetic` | 8 |
| S6 | advanced = `("cycle syncing" OR "cycle-synced" OR "cycle-based skincare" OR "hormonal skincare" OR "menstrual phase" OR "cycle-phase") AND (skin OR acne OR sebum OR dermatolog)` | 23 |

- **Total:** 319 hits, **207 unique NCT IDs.** Most were off-topic (breast cancer, IVF luteal support, PMDD mood trials, thermoregulation), because free-text and synonym expansion match the words anywhere in the record.
- **Narrowing (as the task asked, "plausibly relevant trials"):** I filtered titles, conditions and interventions by skin terms and then read them by hand. **2 trials were added:**
  - NCT03122457: perimenstrual acne treated with clindamycin/benzoyl peroxide gel (Mount Sinai, completed, 22 enrolled). The baseline visit was timed to 1 week before menses. Results are posted.
  - NCT06018168: skincare routine with or without a supplement for acne and PMS symptoms (Clearstem, completed, 60 enrolled). This is industry-sponsored.
- **Not added:** trials of hormonal contraception for acne (NCT01466673, NCT00998257), which the protocol excludes; EVE-PMS hormone skin-test panels (diagnostic allergy tests, not skin outcomes); and menopause, melasma or isotretinoin trials with no cycle-phase comparison. No registered trial compared phase-timed skincare with a steady routine.
- The `year` for trial records is the start year. `abstract` is the brief summary from the registry.

## 3. Consensus

- **Tool:** Consensus connector (`consensus.search`), with no filters.

| Query | Returned | Already in PubMed set | New |
|---|---|---|---|
| `skin changes across the menstrual cycle` | 3 | 1 (PMID 40990961) | 2: Nguyen 2024 scoping review (PMID 39776723); Zouboulis 2025 BJD (PMID 39931829) |
| `premenstrual acne flare prevalence` | 3 | 2 (PMIDs 11712049, 15096370) | 1: Arafa 2020 (PMID 32549185) |
| `skin barrier transepidermal water loss menstrual cycle phase` | 3 | 3 (PMIDs 40583043, 35081394, 1493683) | 0 |

- **Totals:** 9 retrieved, 6 duplicates, **3 added** with source `consensus`. Each carries its Consensus `url`. PMIDs and DOIs were resolved through PubMed. Zouboulis 2025 has no abstract in PubMed, so its `abstract` is the Consensus summary, flagged as `abstract_source`.
- **Limitation:** Consensus returned a sign-up/usage message, not a record, with every search. It said: "Create or connect a free Consensus account to return more than 3 results per search in Claude Code." Each query was therefore capped at 3 results. This supplementary search is not exhaustive.

## 4. medRxiv / bioRxiv

- **Limitation:** the bioRxiv/medRxiv connector has **no keyword search**. It only filters by date and subject category. medRxiv has no dermatology category.
- **What was tried:** `search_preprints`, server = medrxiv, category = `epidemiology`, recent_days = 90, limit = 100. It returned 30 preprints, posted 29 Jun to 1 Jul 2026. None were about skin or the menstrual cycle, so **0 were added.**
- This source is effectively not searched. A future update should use the medRxiv website's full-text search or Europe PMC, which indexes preprints.

## 5. Citation chasing

- **Nguyen et al. 2024**, *Cureus* 16(12):e75286, "Physiological Changes in Women's Skin During the Menstrual Cycle: A Scoping Review". PMID 39776723, PMC11703644, doi 10.7759/cureus.75286.
  - The full text, including the reference list, was read from a PMC full-text copy saved earlier in this session (PMC11703644). The PMID, PMCID and DOI were confirmed with the connector's ID converter.
  - The reference list has 58 entries, listed by title.
  - Entries were kept as candidates if they were **primary studies of a skin outcome by cycle phase**. Reviews, textbooks, menopause/HRT studies, and studies with only skin temperature, blood flow or sweating (thermoregulation, excluded by the protocol) were left out. Breast and forearm skin studies were kept for the screeners to judge, because the protocol grades non-facial sites as indirect evidence rather than excluding them.
  - 6 candidates were identified, and **5 were added** with source `citation`:
    - PMID 2572112: Berardesca 1989, skin extensibility, days 10 vs 25
    - PMID 24301233: Al Mohizea 2013, laser-induced hyperpigmentation by cycle day
    - PMID 26273846: Coumaré 2015, breast skin elasticity
    - PMID 17204039: Mayrovitz 2007, skin tissue water and blood flow
    - DOI 10.4274/turkderm.galenos.2020.35683: "Relationship of cutaneous moisture, sebum and pH changes of healthy skin with menstrual cycle", TURKDERM 2020;54(3):90-95. This is **not indexed in PubMed**. Metadata came from Crossref, which has no abstract, so the screeners need the full text.
  - The 6th candidate, PMID 16258697 (Muizzuddin 2005, "Effect of systemic hormonal cyclicity on skin"), was already in the PubMed set.
- **Named known studies (7):**

| Study | Status |
|---|---|
| PMID 2033132 (Agner 1991) | already in PubMed set |
| PMID 1493683 (Harvell 1992) | already in PubMed set |
| PMID 11712049 (Stoll 2001) | already in PubMed set |
| PMID 15096370 (Lucky 2004) | already in PubMed set |
| Nikoletić/Ivanov 2025 barrier study, PMC12206585 = PMID 40583043, doi 10.1111/srt.70203 | already in PubMed set |
| Burriss 2015, PLOS ONE doi 10.1371/journal.pone.0130093 = PMID 26134671 | already in PubMed set |
| Geller 2014, J Clin Aesthet Dermatol 7(8):30-34, "Perimenstrual flare of adult acne" = PMID 25161758, PMC4142818 | **not found by the search; added** with source `citation` |

- **Total for citation chasing:** 13 candidates, 7 duplicates, **6 added.**
- **Not yet done:** reference lists of the *included* studies, which the protocol requires. That has to wait until screening is finished.

## Limitations

1. **PubMed web pages** were not used, because they can be behind a CAPTCHA. Everything came through the NCBI connector (E-utilities). The count of 473 and the full PMID list come directly from that connector.
2. **Consensus** was capped at 3 results per query by the free-tier message.
3. **medRxiv/bioRxiv** has no keyword search, so preprints are effectively unsearched.
4. **ClinicalTrials.gov** free-text and synonym expansion brings in many off-topic trials. Those were narrowed at title level, which is a light pre-screen for the register source only.
5. **Single database.** Only PubMed was searched in full. Embase, Web of Science and CINAHL were not available, which is acceptable for a rapid review under Cochrane guidance but will miss some studies.
6. **Some records lack abstracts or English text.** 71 PubMed records are not in English and 64 have no abstract. One citation record (TURKDERM 2020) has no abstract anywhere online, so screeners will need the full text.
7. **How the metadata was saved.** Of the 24 metadata batches, 17 were large enough that the tool saved them to disk automatically. The other 7 came back in the chat and were read from the session transcript. All of it was parsed by script, not copied by hand, so titles and abstracts are exactly what the NCBI connector returned.
