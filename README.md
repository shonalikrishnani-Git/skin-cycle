# Skincare — a small, honest prototype

Daily skincare guidance that adapts to **where you are in your cycle**, **what your skin is
normally like**, and **the air around you**. Built 22 Aug 2026.

```bash
cd ~/Projects/skincare-app
npm install     # first time only
npm run dev
```

Then open http://localhost:5180

## Why this exists separately

The Google AI Studio app (`~/Projects/grooming-buddy`) has ~20 features in a single 1,470-line
file, needs a Google sign-in that isn't switched on, a Firebase project, and a Gemini API key.
It's a good source of ideas and a bad place to build.

This is the same core idea, rebuilt small: **no accounts, no server, no database, no API key.**
It runs the moment you type `npm run dev`.

## The idea in one line

> Most skincare apps ask what your skin is like. None of them ask what the weather is doing,
> or where you are in your cycle. Both change what your skin needs today.

## What it does

- **Cycle phase** — day counter and phase, with the hormone shift behind it
- **Climate selector** — four conditions, and the advice genuinely changes when you switch
- **Composed advice** — focus / skip / hair, drawn from all three inputs at once
- **Every tip shows its reason**, and a tag saying whether it came from your cycle, your skin,
  or the weather. No black box.
- **Product shelf** — a bar per product running green → amber → red, so you reorder before you
  run out rather than after

## How it's built

```
src/
  lib/
    cycle.ts      cycle day + phase — ONE function, used everywhere
    advice.ts     the rules engine: phase × skin type × climate → advice
    products.ts   depletion maths
    storage.ts    localStorage
  components/
    Setup.tsx  PhaseStrip.tsx  ClimatePicker.tsx  AdviceCard.tsx  ProductShelf.tsx
  App.tsx       wiring only
```

React 19 + TypeScript (strict) + Vite + Tailwind 4. Nothing else.

Four deliberate differences from the Gemini version:

1. **The cycle day is calculated once.** In the original it was worked out in two places with
   different rounding, so the dashboard and the advice disagreed by a day — and on a phase
   boundary that meant advice for the wrong week.
2. **Nothing pretends to work.** No buttons that claim to place orders or contact pharmacies.
3. **Deleting asks first.**
4. **Form fields have real labels** and buttons carry `aria-pressed`, so it's usable with a
   screen reader.

## Verified working 22 Aug 2026

Setup → main screen ✅ · Day 25 / Luteal correct ✅ · switching climate swaps the weather tips ✅ ·
reload keeps everything ✅ · shelf shows in-stock, running-low and empty at once ✅ · mobile
layout ✅ · `tsc --noEmit` clean ✅

## Honest limits

- The advice is **general skincare principles, not medical advice**, and says so on screen.
- Climate is still chosen by hand. Real weather from your location is the obvious next step.
- Nothing is logged over time yet — no history, no streaks.
- Everything lives in one browser. Clear your site data and it's gone.

## Next

1. Real weather by location, so the app stops asking what it could know
2. A daily log, then a look-back view — the thing the original collected and never showed
3. A written one-page product concept to sit alongside it (Project 5 asks for both)
