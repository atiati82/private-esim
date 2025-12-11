import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';

const isCI = !!process.env.CI;

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    silent: isCI,
    environment: 'node',
    setupFiles: ['./tests/tests-setup.js', './tests/payload-mocks.ts'],
    include: ['./src/**/*.{test,spec}.{ts,tsx}'],
    server: {
      deps: {
        inline: ['@payloadcms/richtext-lexical', '@payloadcms/ui'],
      },
    },
  },
  server: {
    watch: {
      ignored: ['./.next/**', './.cache/**', './.dist/**'],
    },
  },
  ssr: { noExternal: [/\.css$/] },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src/') },
      {
        find: '@payload-config',
        replacement: resolve(__dirname, './src/payload/payload.config.ts'),
      },
    ],
  },
});
