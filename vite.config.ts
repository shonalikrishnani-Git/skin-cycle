import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // The production build now lives one level down, at .../skin-cycle/app/ — the site root is a
  // plain static landing page (see site/), built separately and copied in by
  // scripts/build-site.mjs. Keep the dev server at plain "/" so `npm run dev` still opens at
  // http://localhost:5180 exactly as before.
  base: command === 'build' ? '/skin-cycle/app/' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
  build: {
    outDir: 'dist/app',
  },
}));
