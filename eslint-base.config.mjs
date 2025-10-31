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
  '**/*.config.*',
  '**/dist/**',
  '**/node_modules/**',
  '**/coverage/**',
];

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
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
};

