import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // The production build lives one level down, at .../<repo>/app/ — the site root is a plain
  // static landing page (see site/), copied in by scripts/build-site.mjs. A relative base means
  // the build works under any repo name, so renaming the app doesn't break its assets. (There's
  // no router, so relative asset paths are safe.) The dev server stays at plain "/".
  base: command === 'build' ? './' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
  build: {
    outDir: 'dist/app',
  },
}));
