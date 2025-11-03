/**
 * Shared ESLint base configuration
 * Contains common rules and ignore patterns used by both backend and frontend
 * 
 * Each config file imports its own dependencies and applies these rules
 */

/**
 * Shared ignore patterns
 */
export const baseIgnores = [
  // Build tool configs (vite, vitest, playwright, tsconfig)
  '**/vite.config.*',
  '**/vitest.config.*',
  '**/playwright.config.*',
  '**/tsconfig*.json',
  // Dist, dependencies, and coverage
  '**/dist/**',
  '**/node_modules/**',
  '**/coverage/**',
]

/**
 * Shared ESLint rules
 * These rules are applied to both backend and frontend configurations
 */
export const baseRules = {
  // Prettier integration
  'prettier/prettier': 'error',

  // General ESLint rules
  'no-console': 'off',
  'no-debugger': 'warn',
  'no-unused-vars': 'off',
  'no-empty': ['error', { allowEmptyCatch: true }],

  // TypeScript rules (shared across frontend and backend)
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  // Note: consistent-type-imports is NOT in base config
  // - Frontend: Uses it explicitly (safe for React/TypeScript)
  // - Backend: Does NOT use it (NestJS DI requires runtime class references)
};

