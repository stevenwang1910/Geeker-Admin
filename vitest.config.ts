import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.git/',
        '*.config.*',
        '*.d.ts',
        'src/main.ts',
        'src/vite-env.d.ts'
      ]
    },
    alias: {
      '@': resolve(__dirname, 'src')
    },
    deps: {
      inline: ['element-plus']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});