// Imports
// -----------------------------------------------------------------------------
import { defineConfig } from 'vite'

// Configuration
// -----------------------------------------------------------------------------
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    origin: 'http://127.0.0.1:5173',
    cors: { origin: 'http://127.0.0.1:3000' },
  },
  build: {
    manifest: true,
    outDir: 'frontend/.pannonico/vite',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        app: 'frontend/src/app.ts',
        // HTML loads this entry directly before the app, including in development.
        styles: 'frontend/src/styles/index.scss',
      },
    },
  },
})
