import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: ruta donde GitHub Pages sirve el sitio (https://<usuario>.github.io/<repo>/).
// En local (dev) se usa '/'; en build para Pages se usa '/tablero-priorizacion/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/tablero-priorizacion/' : '/',
  server: {
    port: 5173,
    open: true,
  },
});
