import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: __dirname,
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})