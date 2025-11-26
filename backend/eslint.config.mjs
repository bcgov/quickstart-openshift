import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * Shared ignore patterns (inlined from eslint-base.config.mjs)
 */
const baseIgnores = [
  // Build tool configs (vite, vitest, playwright, tsconfig)
  '**/vite.config.*',
  '**/vitest.config.*',
  '**/playwright.config.*',
  '**/tsconfig*.json',
  // Dist, dependencies, and coverage
  '**/dist/**',
  '**/node_modules/**',
  '**/coverage/**',
];

/**
 * Shared ESLint rules (inlined from eslint-base.config.mjs)
 * Note: consistent-type-imports is NOT included here because NestJS DI requires runtime class references
 */
const baseRules = {
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
};

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    ignores: [...baseIgnores],
    plugins: {
      prettier,
    },
    rules: {
      ...baseRules,
      // Additional backend-specific rules can be added here
    },
  },
);

