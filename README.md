# Skin Cycle

Skincare that follows your cycle — a private skin diary with week-by-week tips, where every
health claim is backed by a source.

**[Live site](https://shonalikrishnani-git.github.io/skin-cycle/)** ·
**[1-minute tour](https://shonalikrishnani-git.github.io/skin-cycle/app/?tour)** ·
**[Case study](https://shonalikrishnani-git.github.io/skin-cycle/about.html)**

A portfolio project by **Sonali Krishnani** (M.Sc. Microbiology, Biology teacher), built with
**Claude Code**, an AI coding assistant.

| Today | Guide | Diary |
|---|---|---|
| ![Today](site/screenshots/today.png) | ![Guide](site/screenshots/guide.png) | ![Diary](site/screenshots/diary.png) |

## What it does

- **Today** — what skin tends to need this week, matched to your skin type, plus a two-tap diary:
  tick your routine steps and rate your skin.
- **Guide** — each phase's routine, home care with an evidence level and a caution on every remedy,
  myths, when to see a GP, and 66 sources.
- **Diary** — a calendar coloured by cycle phase, and your own skin pattern once there's enough data.
- **Your routine** — pick suggested steps or type your own, in your order.
- **Tour** — a guided demo with a sample diary. Nothing is saved.

No account, no server: everything stays in your browser.

## My role

- Product idea and direction: skin first, the cycle as context — not a period tracker.
- The rules the advice must follow: ingredient types, not brands; no "toxic" scores; no scraped
  reviews; a caution on every remedy; no claim without a source.
- Led three rounds of fact-checking and made every call on what to cut and keep.

Claude Code wrote the code, ran the research and review agents, and applied their findings.

## How the advice was checked

Every claim was treated as wrong until an opened source backed it (AAD, NHS, HSE, DermNet, FDA,
PubMed). That cut honey and aloe vera, replaced ice on a deep spot with the AAD's warm-compress
advice, corrected a pregnancy note and an under-urgent warning sign, and moved "ovulation glow" to
the myths list. The app says plainly that research on skin across the cycle is thin.

Automated tests fail if a remedy loses its caution, a source goes unused, or a published count
drifts from the data. The rules for adding guidance are at the top of `src/lib/skin.ts`.

## Run it

```bash
npm install
npm run dev     # the app at http://localhost:5180
npm test        # cycle maths, content checks, routine and storage
npm run build   # typecheck, build the app into dist/app, copy the landing pages into dist/
```

Needs Node 23.6+. Deployed to GitHub Pages from `main` by `.github/workflows/pages.yml`.
`node scripts/screenshots.mjs` (with the dev server running and Google Chrome installed)
retakes the landing page screenshots and link-preview image.

## How it's built

React 19, strict TypeScript, Vite, Tailwind 4 — nothing else.

```
src/lib/        skin.ts (the guidance and sources) · cycle.ts (phase maths) · log.ts (diary, routine)
                storage.ts (localStorage, validated on load) · brand.ts (the app name)
src/components/ Onboarding · Settings · RoutineEditor · Tour · SkinToday · CheckIn · Guide
                Sources · Calendar · Pattern · CycleCard
site/           the static landing page and case study
tests/          cycle, content, and routine/storage tests
```

## Verified 27 Sep 2026

Welcome page, three-step setup and your own routine steps work at 375px and on desktop · the tour
runs all four steps without saving anything · 10 don't-try items and 66 sources render · no text
under 12px, and muted text passes WCAG AA contrast · `npm test` and `npm run build` pass.

## Limits

- Not yet reviewed by a pharmacist or dermatologist — the checks were done by AI agents.
- General skincare information, not medical advice or contraception.
- Phases are estimates from the dates you log.
- One browser on one device; clearing site data erases the diary.
- "Skin Cycle" is a working title.
