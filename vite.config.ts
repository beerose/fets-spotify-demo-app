import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mix$ from 'vite-plugin-mix'

const mix = (mix$ as any).default ?? mix$

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mix({
      handler: './src/api.ts',
    }),
  ],
})
