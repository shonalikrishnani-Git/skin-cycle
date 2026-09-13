// Cycle maths tests. Run with: npm test  (Node 23.6+ strips the TypeScript types itself — no build step.)
// These pin the edge cases that were actually wrong at some point: fixed 28-day boundaries,
// wrap-around on a late period, and an off-by-one in lateness.
import {
  phaseRanges, cycleInfoFor, nextPeriod, parseISO, addDays,
} from '../src/lib/cycle.ts';

const today = '2026-09-11';
let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`}`);
};
const r = (L, P) => phaseRanges(L, P).map(x => `${x.phase[0]}${x.start}-${x.end}`).join(' ');

check('28-day cycle matches the old fixed boundaries', r(28, 5), 'M1-5 F6-11 O12-16 L17-28');
check('35-day cycle moves ovulation later',            r(35, 5), 'M1-5 F6-18 O19-23 L24-35');
check('21-day cycle: follicular can be empty',         r(21, 5), 'M1-5 F6-5 O6-9 L10-21');

const d14 = cycleInfoFor(today, [addDays(today, -13)], 28, 5, today);
check('Day 14 of 28 is ovulatory', [d14.day, d14.phase, d14.late], [14, 'Ovulatory', 0]);

const late = cycleInfoFor(today, [addDays(today, -31)], 28, 5, today);
check('Day 32 of 28: due day 29, so 3 days late', [late.day, late.phase, late.late], [32, 'Luteal', 3]);
const due = cycleInfoFor(today, [addDays(today, -28)], 28, 5, today);
check('Day 29 of 28 is due today, not late', [due.day, due.late, nextPeriod([addDays(today, -28)], 28, today).late], [29, 0, 0]);
check('nextPeriod agrees with cycleInfo on lateness', nextPeriod([addDays(today, -31)], 28, today).late, late.late);

const futureWhileLate = cycleInfoFor(addDays(today, 3), [addDays(today, -31)], 28, 5, today);
check('Future while late predicts from tomorrow, not the past',
  [futureWhileLate.day, futureWhileLate.phase, futureWhileLate.estimated], [3, 'Menstrual', true]);

const closed = cycleInfoFor('2026-07-20', ['2026-07-01', '2026-08-05'], 28, 5, today);
check('Finished 35-day cycle uses its REAL length',
  [closed.day, closed.cycleLength, closed.phase], [20, 35, 'Ovulatory']);

const before = cycleInfoFor('2026-08-09', ['2026-08-10'], 28, 5, today);
check('Day before first logged period = day 28, estimated',
  [before.day, before.phase, before.estimated], [28, 'Luteal', true]);

check('Impossible date rejected', parseISO('2026-02-31'), null);
check('No periods logged -> no info', cycleInfoFor(today, [], 28, 5, today), null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
