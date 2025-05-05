import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/algovis/',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: '/src/index.ts'
    }
  }
});
