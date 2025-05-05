import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: __dirname,
  base: "/algovis/",
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