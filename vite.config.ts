import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base garante que os assets usem o caminho correto no GitHub Pages (/repo-name/)
  base: '/sistema-funcionarios-irrf/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
