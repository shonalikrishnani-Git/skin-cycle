# Skin Cycle

Skincare that follows your cycle.

Track your routine and how your skin feels, and get simple, safe guidance for each week of your
month — what to hydrate and moisturise with, what to go easy on, and home care that has actually
been checked.

```bash
cd ~/Projects/skincare-app
npm install     # first time only
npm run dev     # then open http://localhost:5180
npm test        # the cycle maths and the content checks (Node 23.6+)
```

No account, no server, no API key. Everything stays on the device.

## What it does

**Today** opens on *your skin today*: what skin tends to do this week and why, three tiles
(hydrate · moisturise · go easy on), a tip for your skin type, and one home-care idea. Below it is
today's routine — morning and evening steps, home care, how your skin feels, tags, a note — and
then a small card for your cycle with *my period started today*.

**Guide** is the full guide for any phase: your routine with the reason for each item, safe home
care with an honest evidence level and a caution on every remedy, *don't try this at home*,
*heard online — not quite true*, notes on pregnancy and the pill, when to see a pharmacist or GP,
and 66 sources. A **Sources** view, reachable from the bottom of the Guide, lists every sourced
claim with its phase, evidence label and backing source in one place — built straight from
`skin.ts`'s own data, so it can't drift out of sync with the guidance it's describing.

**Diary** is a calendar tinted by phase, with a face on each day you rated your skin — tap any past
day to fill it in — and *your skin pattern*: how your skin has felt in each phase, with one plain
sentence once there's enough data to say something true.

## How the guidance was written

Two research agents checked every remedy and product tip against the AAD, NHS, DermNet, the FDA
and published studies, and the three most surprising claims were then opened and checked by hand.
That changed a lot:

- **Honey — cut.** A randomised trial found it no better than soap for acne.
- **Aloe vera — cut.** Only two small studies, used alongside other treatments, and it can cause rashes.
- **Ice on a deep spot — replaced** by the AAD's current advice: a warm compress, 10–15 minutes,
  three times a day.
- **Oatmeal** is "some evidence", not "good" — the studies were in eczema.
- **Green tea** is "little evidence" — lotions were tested; brewed tea wasn't.
- **"Drier and duller during your period"** was removed. What *is* supported is that skin reacts
  more easily around day 1.
- **"Ovulation glow"** is a myth, and now sits in the myths list.
- **The combined pill** stops ovulation, so the phases may not apply — the app says so.

The line the app shows: *your cycle can nudge your skin, but no study yet shows that switching
products by phase beats a steady, gentle routine — treat these as timing tips, not rules.*

The rules for adding anything to the guidance are at the top of `src/lib/skin.ts`.

## How it's built

```
src/
  lib/
    skin.ts       the guidance: phases, remedies, don't-try, myths, sources
    cycle.ts      phases and dates — where any day sits in the cycle
    log.ts        the skin diary: routine steps, ratings, the per-phase pattern
    storage.ts    localStorage, validated on load
  components/
    SkinToday.tsx  Guide.tsx      CheckIn.tsx
    CycleCard.tsx  CycleRing.tsx  Calendar.tsx
    Pattern.tsx    Setup.tsx      Icons.tsx
    Sources.tsx    guideStyles.ts (claim -> source table, reachable from Guide)
  App.tsx        tabs and wiring only
tests/
  cycle.test.mjs   12 edge cases for the cycle maths
  content.test.mjs every remedy has a caution, every source is used, counts match this README
design/            source for the design canvas — app screens and ideas
```

React 19, strict TypeScript, Vite, Tailwind 4. Nothing else.

## Decisions worth knowing

1. **Skin first, cycle second.** The cycle is the context for the guidance, not the headline — an
   earlier version read like a period tracker.
2. **Phases scale with your cycle.** Ovulation is counted back ~14 days from the end, so a 35-day
   cycle isn't treated like a 28-day one.
3. **Finished cycles use their real length**, and a late period doesn't wrap round to "day 4".
4. **Routine steps, not yes/no.** Morning: cleanse, serum, moisturise, SPF. Evening: cleanse,
   treatment, moisturise. Steps always stay in routine order.
5. **Untouched days never count as "okay"**, and the pattern stays quiet until it has at least 3
   rated days in 2 phases with a half-point gap.
6. **Skin type shapes the advice**, not just a tip line. Today's hydrate/moisturise/go-easy-on
   tiles now show different wording for oily, dry, combination and sensitive skin (texture only —
   same ingredient, per AAD's own moisturiser-by-skin-type guidance), and Luteal's "go easy on"
   tile swaps in the face-oil warning for oily/combination skin instead of the generic one.
   Profiles saved before skin type was asked get "Normal" rather than being thrown away.
7. **Storage v2.** Diary entries moved to `skincycle:v2:logs` when routine steps replaced yes/no.
   v1 entries came only from prototype testing and aren't migrated; *delete all* removes both.
8. **Drawn icons, 44px tap targets, local date.** Emoji differ on every phone; `toISOString()` is
   UTC and reports yesterday for the first hour after midnight in Irish summer time.
9. **Not medical advice, not contraception** — said on screen, not just here.
10. **Accessible basics.** A real `<h1>` and `<main>` landmark, no text under 12px, and text that
    was measurably low-contrast (a 3.55:1 hormone line, a 3.86:1 evidence badge) now passes WCAG
    AA (4.5:1) against its actual background.

## Deliberately left out

The larger prototype (advice by weather, product shelf, ingredient checker, label reader) is kept on
the `full-version` branch, tag `v1-full`. Two things were rejected outright:

- **"Toxic ingredient" scores** — toxicity depends on dose and route, which an ingredient list
  doesn't have.
- **Scraped retail reviews** — retailers' terms forbid it, and star ratings are the noise this app
  is an alternative to.

## Design and next ideas

https://claude.ai/code/artifact/97a50273-043c-46af-a344-2f9b4fb67870

- **App page** — Setup, Today, Guide, Diary.
- **Ideas page** — three directions from agents that each looked at the app through one lens:
  *Shelf Sync* (your own products, at the right time), *Skin Report* (six weeks of logs on one
  honest page), and *Steady Start* (from no routine to one you keep). Suggested order: Shelf Sync
  first.

## Idea branches — working prototypes, not merged

Two of the ideas were built on their own branches overnight, so `main` stays exactly as described
above.

| Branch | Folder | What it adds |
|---|---|---|
| `idea/shelf-sync` | `~/Projects/skincare-app-shelf-sync` | A Shelf tab for the products you own, and a Today card saying *lean into / keep steady / ease off* for each one this phase |
| `idea/skin-report` | `~/Projects/skincare-app-skin-report` | A one-page report from your own entries — by phase, routine vs skin, top tags — saved as a PDF, with notes left out unless you switch them on |

To try one:

```bash
cd ~/Projects/skincare-app-shelf-sync && npx vite --port 5181
```

(`skincare-app-skin-report` on port 5182.) Each branch's README explains what it adds and its
limits. Both typecheck, build, pass the tests, and were used end to end in the browser on
14 Sep 2026. Shelf Sync's rules were checked line by line against `src/lib/skin.ts` and five were
corrected; Skin Report's routine comparison matched an independent calculation. To adopt one
later: `git merge idea/shelf-sync`.

## Validation — how precise the guidance is

Every sentence of health guidance in `src/lib/skin.ts` was checked on 14 Sep 2026 by four
independent validation agents, split by section. Each treated a claim as wrong until a source it
actually opened (AAD, NHS, HSE, DermNet, FDA, PubMed/PMC) supported it, checking numbers, hedging,
evidence labels, cautions, pregnancy and breastfeeding, and any suggestion that a phase *causes*
an effect. The most surprising figures were then opened again by hand.

That pass found real problems, all fixed: an incomplete pregnancy note, a retinoid suggestion with
no pregnancy warning, under-urgent GP warning signs, an unsourced compress time, a mixed-up
"44–65%" statistic, and "Good evidence" labels on advice that had no trials (now
"Dermatologist advice"). Sources went from 22 to 64.

A later review found that the check had covered `skin.ts` only, so a wording error in `cycle.ts`,
a "honey mask" example in the note field, and this README had slipped through. Those are fixed,
and future checks cover all on-screen text.

**Re-checked 17 Sep 2026**, wider this time: every claim in `skin.ts` and the hormone lines in
`cycle.ts` again, plus a grep of the whole repo (not just `src/`) for stray wording. That found the
same "honey mask" placeholder still sitting in `design/Main.dc.html` — the earlier fix only reached
the live component, not the design mockup that mirrors it — now fixed there too. Three real content
problems, all corrected: the "Squalane" source actually covered squalene (the related, oxidation-
prone lipid in sebum), not a test of squalane itself, so the source label and wording were
corrected rather than left implying a citation it didn't support; the cellulitis-type warning in
`SEE_SOMEONE` grouped a fever in with "GP urgently" when HSE treats a fever alongside those
symptoms as a 112/999 sign; and the breastfeeding note didn't cover benzoyl peroxide or salicylic
acid even though both are named in the Luteal guidance and the pregnancy note already covers them
— LactMed rates both low risk while breastfeeding, so that note now says so. Two LactMed sources
were added for that (64 → 66). Every number, evidence label, and source-to-claim match checked
against a source actually opened — including every study behind a specific figure — held up.
Content tests (`tests/content.test.mjs`) now catch a missing caution, an unused source, or a count
drifting from this README automatically.

**Not yet done:** review by a pharmacist or dermatologist. The validation was performed by AI
agents, not a qualified professional.

## Who did what

- **Sonali** — the idea and its direction: skin first, the cycle as context; the rules the
  guidance follows (ingredient types not brands, no "toxic" scores, no scraped reviews, a caution on
  every remedy); insisting every health claim be validated before release; and the calls on what
  to cut and keep.
- **Claude Code** (an AI coding assistant) — wrote the code, ran the research, validation and
  review agents, and applied their findings.

## Verified 17 Sep 2026

In the running app: setup requires a skin type · Today opens on "Your skin today" · routine steps
save in order · editing a sample day keeps only what you changed, with an explanatory note the
moment it happens · Today's hydrate/moisturise/go-easy-on tiles differ by skin type, checked for
all five types · all four Guide phases show the validated wording, and every remedy carries an
evidence level and a caution · the new Sources view lists every claim with a working source link,
checked on desktop and at 375px · 10 don't-try items, the pregnancy, breastfeeding and pill notes,
and 66 sources render · honey and aloe appear nowhere on screen, including the design mockups ·
sample data shows no cycle pattern · a real `<h1>`/`<main>`, no text under 12px, and the two
previously low-contrast elements pass WCAG AA · no console errors · `tsc --noEmit` clean ·
`npm run build` succeeds · 12/12 cycle tests and 243/243 content tests pass (every remedy has a
caution, every source is referenced, and the counts above match the code).

## Honest limits

- One device, one browser. Clearing site data erases everything.
- **"Skin Cycle" is a working title.** Other apps already use the name, and "skin cycling" is an
  established skincare trend — it should be renamed before anything is shared publicly.
- General skincare information only — not medical advice, not a medical device, not contraception.
- Phases are estimates from the dates you log.
- The research on skin across the cycle is thin; the app says so rather than pretending otherwise.
- New installs get eight weeks of sample entries — labelled as sample, removable in one tap.
