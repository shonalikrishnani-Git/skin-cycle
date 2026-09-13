# Skin Cycle

Skincare tracking and your menstrual cycle, hand in hand.

Most skincare apps ask what your skin is like. This one asks *when* — because skin changes
through the month, and once you've logged a few weeks you can see exactly how yours does.

```bash
cd ~/Projects/skincare-app
npm install     # first time only
npm run dev     # then open http://localhost:5180
npm test        # the cycle maths (Node 23.6+)
```

No account, no server, no API key. Everything stays on the device.

## What it does

- **Today** — a ring showing your whole cycle and where you are in it, what your skin tends to do
  this week, and one tap for *my period started today*.
- **Check-in** — how your skin feels (five faces), morning and evening routine, a few tags, a
  note. Ten seconds.
- **Calendar** — every day tinted by its phase, a face on each day you rated. Tap any past day to
  fill it in or fix it; future days are faded because they're predictions.
- **Your skin pattern** — your average skin rating in each phase, and one plain sentence about it,
  such as *"Your skin feels best in your ovulatory phase and hardest in your luteal phase —
  usually logged as oily."*

## How it's built

```
src/
  lib/
    cycle.ts      phases, dates, where any day sits in the cycle — the heart of it
    log.ts        daily entries, the per-phase pattern, sample history
    storage.ts    localStorage, with shape validation on load
  components/
    Setup.tsx      first run + settings
    TodayCard.tsx  CycleRing.tsx
    CheckIn.tsx    Calendar.tsx   Pattern.tsx
    Icons.tsx      drawn faces, sun, moon, check, chevrons
  App.tsx        wiring only
tests/
  cycle.test.mjs 12 edge cases for the cycle maths
design/          the design canvas's source screens
```

React 19, strict TypeScript, Vite, Tailwind 4. Nothing else.

## Decisions worth knowing

1. **Phases scale with your cycle.** Ovulation is counted back ~14 days from the *end*, because the
   luteal phase is the steadiest part of a cycle. An earlier prototype hard-coded 28-day
   boundaries and put the luteal phase a week early on a 35-day cycle.
2. **Finished cycles use their real length.** Once your next period is logged, the days before it
   are re-placed using how long that cycle actually was.
3. **A late period doesn't wrap around.** Day 32 of a 28-day cycle says day 32, three days late —
   not "day 4, menstrual". Day 29 counts as *due*, not late.
4. **An untouched day never counts as "okay".** Unrated days are left out of the pattern instead of
   quietly scoring 3/5.
5. **The pattern stays quiet until it has something true to say** — at least 3 rated days in at
   least 2 phases, and a gap of half a point or more.
6. **Today is your local date.** `toISOString()` is UTC, which in Irish summer time reports
   yesterday's date for the first hour after midnight.
7. **Drawn icons, not emoji**, and every tap target is at least 44px.
8. **Not contraception, not medical advice** — said on screen, not just here.

## Deliberately left out

The larger version — advice engine, weather, product shelf, the Learn tab with skin science, an
ingredient checker and a label reader — is kept on the `full-version` branch (tag `v1-full`). It
was set aside to keep this app simple, not thrown away.

Two things were rejected outright, and shouldn't come back:

- **"Toxic ingredient" scores.** Toxicity depends on dose and route; an ingredient list has neither,
  which is why dermatologists and cosmetic chemists reject Yuka / Think Dirty style ratings.
- **Scraped retail reviews.** Retailers' terms forbid it, and star ratings are the same noise this
  app is meant to be an alternative to.

## Design

The screens are on a Claude Design canvas:
https://claude.ai/code/artifact/97a50273-043c-46af-a344-2f9b4fb67870 — source in `design/`.

## Verified 13 Sep 2026

In the running app, not assumed: empty and future dates rejected at setup · day 14 of 28 shows
ovulatory with "next period in about 15 days" · check-in saves face, routine, tag and note ·
logging a period moves the ring to day 1, and undo moves it back · calendar tints, today ring,
faded predictions and the dashed expected period all correct · editing a sample day makes it
yours · removing sample entries keeps only real ones · a 35-day cycle moves day 14 to follicular ·
delete-all empties storage · 44px cells and chips on a 375px phone with no sideways scroll ·
no console errors · `tsc --noEmit` clean · 12/12 cycle tests pass.

## Honest limits

- One device, one browser. Clearing site data erases everything.
- Phases are estimates from the dates you enter.
- New installs get eight weeks of sample entries so the calendar isn't empty — labelled as sample,
  removable in one tap.
