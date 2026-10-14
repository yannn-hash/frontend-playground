import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
let release = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || 'local';
if (release === 'local') {
  try {
    release = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    /* Initial local build has no commit. */
  }
}

export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.env.VITE_RELEASE_SHA': JSON.stringify(release) },
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
  preview: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'none'",
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replaceAll('\\', '/');
          if (/\/node_modules\/(?:@codemirror|codemirror|@lezer)\//.test(path)) {
            return /\/(?:lang-css|lang-javascript|css|javascript)\//.test(path)
              ? 'editor-languages'
              : 'editor-core';
          }
        },
      },
    },
  },
});
