import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    exclude: ['dist/*', 'node_modules/*'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reportsDirectory: './reports/tests/coverage'
    },
  },
})
