import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    exclude: ['**/node_modules/**', '**/e2e/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/test-setup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: false,
    coverage: {
      reporter: ['lcov', 'text-summary', 'text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.config.*',
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/playwright.config.*',
        'src/routeTree.gen.ts', // Auto-generated file by TanStack Router
        'src/**/*.test.ts', // Test files
        'src/**/*.spec.ts', // Test files
        'src/**/*.test.tsx', // Test files
        'src/**/*.spec.tsx', // Test files
        'src/__tests__/**', // Test directory
        'src/test-setup.ts', // Test setup file
        'src/test-utils.tsx', // Test utilities
        'src/**/*.d.ts', // TypeScript declaration files
      ],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
})
