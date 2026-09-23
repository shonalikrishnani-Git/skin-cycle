// Copies the static landing/closing pages in site/ into dist/, alongside the React app that
// `vite build` already placed at dist/app/ (see vite.config.ts). Run after `vite build`, never
// before — it doesn't touch dist/app/, but it doesn't create dist/ either.
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const site = join(root, 'site');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  throw new Error('dist/ does not exist yet — run `vite build` before this script.');
}

cpSync(site, dist, { recursive: true });
console.log('Copied site/ (landing + closing pages) into dist/.');
