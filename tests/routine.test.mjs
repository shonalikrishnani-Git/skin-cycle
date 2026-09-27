// Routine and storage tests. Run with: npm test
// Your own routine steps: adding, ordering, and — the part that matters — past days keeping steps
// you've since removed, and stored data being checked on load rather than trusted.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const { addStep, moveStep, toggleStep, cleanStepName, sampleHistory, DEFAULT_ROUTINE, MAX_STEPS } = await import('../src/lib/log.ts');
const { loadProfile, loadLogs, saveLogs } = await import('../src/lib/storage.ts');

let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`}`);
};

// --- Editing a routine -----------------------------------------------------------------------
check('typed steps are tidied', cleanStepName('  gua   sha '), 'Gua sha');
check('adding a step appends it', addStep(['Cleanse'], 'toner'), ['Cleanse', 'Toner']);
check('duplicates are ignored, whatever the case', addStep(['Cleanse', 'SPF'], 'spf'), ['Cleanse', 'SPF']);
check('blank steps are ignored', addStep(['Cleanse'], '   '), ['Cleanse']);
const full = Array.from({ length: MAX_STEPS }, (_, i) => `Step ${i}`);
check(`a routine stops at ${MAX_STEPS} steps`, addStep(full, 'One more').length, MAX_STEPS);
check('moving a step earlier', moveStep(['A', 'B', 'C'], 2, -1), ['A', 'C', 'B']);
check('moving the first step earlier does nothing', moveStep(['A', 'B'], 0, -1), ['A', 'B']);

// --- Ticking steps on a day ----------------------------------------------------------------------
check('ticked steps follow routine order', toggleStep(['Cleanse', 'Serum', 'SPF'], ['SPF'], 'Cleanse'), ['Cleanse', 'SPF']);
check('a removed step stays on a day that logged it', toggleStep(['Cleanse', 'SPF'], ['Cleanse', 'Retinol'], 'SPF'), ['Cleanse', 'SPF', 'Retinol']);
check('a removed step can still be unticked', toggleStep(['Cleanse'], ['Cleanse', 'Retinol'], 'Retinol'), ['Cleanse']);

// --- Loading what's stored ----------------------------------------------------------------------
const put = (k, v) => store.set(k, JSON.stringify(v));
put('skincycle:v1:profile', { periodStarts: ['2026-09-01'], cycleLength: 28, periodLength: 5, skinType: 'Oily' });
check('profiles from before custom routines get the old built-in routine', loadProfile()?.routine, DEFAULT_ROUTINE);

put('skincycle:v1:profile', {
  periodStarts: ['2026-09-01'], cycleLength: 30, periodLength: 5, skinType: 'Dry',
  routine: { am: ['Cleanse', 'gua sha', 'Cleanse', 42], pm: [] },
});
check('a stored routine is cleaned, de-duplicated and kept', loadProfile()?.routine, { am: ['Cleanse', 'Gua sha'], pm: [] });

put('skincycle:v1:profile', { periodStarts: ['2026-09-01'], cycleLength: 0, periodLength: 5, skinType: 'Dry' });
check('an impossible cycle length is rejected, not used', loadProfile(), null);

saveLogs([{ date: '2026-09-02', am: ['Cleanse', 'Retinol'], pm: ['Face oil'], homeCare: false, skin: 4, tags: [], note: '' }]);
check('logged custom steps survive a reload', loadLogs()[0].am.concat(loadLogs()[0].pm), ['Cleanse', 'Retinol', 'Face oil']);

// --- Sample entries use your routine ------------------------------------------------------------------
const mine = { periodStarts: ['2026-09-01'], cycleLength: 28, periodLength: 5, skinType: 'Normal', routine: { am: ['Wash', 'Sunscreen'], pm: ['Wash'] } };
const steps = new Set(sampleHistory(mine, '2026-09-27').flatMap((l) => [...l.am, ...l.pm]));
check('sample entries only use your own steps', [...steps].sort(), ['Sunscreen', 'Wash']);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
