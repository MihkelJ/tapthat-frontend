import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@yodlpay/yapp-sdk'],
    include: [],
  },
  ssr: {
    noExternal: ['@yodlpay/yapp-sdk'],
  },
  build: {
    commonjsOptions: {
      include: [/@yodlpay\/yapp-sdk/, /node_modules/],
    },
  },
});
