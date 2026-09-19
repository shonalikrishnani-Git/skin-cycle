import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Served from https://shonalikrishnani-git.github.io/skin-cycle/ on GitHub Pages
  base: '/skin-cycle/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180 },
});
