import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const codespaceDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
const isCodespace = Boolean(process.env.CODESPACE_NAME);

// Codespaces serves forwarded ports from *.app.github.dev. Allow local hosts
// and the Codespaces domain so Vite does not reject the forwarded Host header.
const allowedHosts = ['localhost', '.app.github.dev', '.githubpreview.dev'];
if (codespaceDomain) allowedHosts.push(`.${codespaceDomain}`);

const proxy = {
  // Keep the browser on a single forwarded origin. Vite proxies API calls to
  // the Express server inside the Codespace, so cookies remain first-party.
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: false,
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts,
    // HMR is served through the HTTPS forwarded port in Codespaces.
    hmr: isCodespace ? { protocol: 'wss', clientPort: 443 } : undefined,
    proxy,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts,
    proxy,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('react-select')) return 'vendor-select';
          if (id.includes('react-phone-number-input') || id.includes('libphonenumber-js')) {
            return 'vendor-phone';
          }
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
});
