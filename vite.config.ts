import { defineConfig } from 'vitest/config'
// Vite-tsconfig-paths so Vitest can understant @/src imports
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
