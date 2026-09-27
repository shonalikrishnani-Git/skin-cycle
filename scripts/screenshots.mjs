// Retakes the landing page's phone screenshots from the running app, using its sample diary.
//   npm run dev        (in another terminal)
//   node scripts/screenshots.mjs
// Needs Google Chrome and Node 22+. Writes site/screenshots/*.png — a 390x844
// phone at 2x — through Chrome's own device emulation (headless windows can't go below ~500px) —
// and site/og.png, the 1200x630 link preview.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const chromePath = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const base = process.env.APP_URL ?? 'http://localhost:5180/';
const port = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), 'shots-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], {
  stdio: 'ignore',
});

try {
  let targets;
  for (let i = 0; i < 50 && !targets; i++) {
    await sleep(200);
    targets = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).catch(() => undefined);
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));

  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) pending.get(msg.id)(msg.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      pending.set(++id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  // Each shot: the file name, the tab, and (optionally) a heading to scroll to the top of the screen.
  const shots = [
    ['today', 'today'],
    ['routine', 'today', 'Today’s routine'],
    ['guide', 'guide', 'Home care'],
    ['diary', 'diary'],
  ];
  for (const [name, tab, heading] of shots) {
    await send('Page.navigate', { url: `${base}?shot=${tab}` });
    await sleep(1500);
    if (heading) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const h = [...document.querySelectorAll('h2')].find((e) => e.textContent.trim() === ${JSON.stringify(heading)});
          const card = h?.closest('section') ?? h;
          if (card) window.scrollTo(0, card.getBoundingClientRect().top + window.scrollY - 84);
        })()`,
      });
      await sleep(400);
    }
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const out = join(root, 'site', 'screenshots', `${name}.png`);
    writeFileSync(out, Buffer.from(data, 'base64'));
    console.log(`Saved ${out}`);
  }
  // The link-preview image, drawn from scripts/og.html with the fresh Today screenshot.
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `file://${join(root, 'scripts', 'og.html')}` });
  await sleep(1000);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(root, 'site', 'og.png'), Buffer.from(data, 'base64'));
  console.log('Saved site/og.png');
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
