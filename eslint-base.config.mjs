/**
 * Shared ESLint base configuration
 * Contains common rules, ignores, and setup used by both backend and frontend
 */

/**
 * Common ignore patterns
 */
export const baseIgnores = [
  '**/.git/',
  '**/.github/',
  '**/migrations/',
  '**/node_modules/',
  '**/dist/**',
  '**/coverage/**',
  '**/vite.config.*',
  '**/vitest.config.*',
  '**/playwright.config.*',
  '**/tsconfig*.json',
];

/**
 * Common ESLint rules shared by both backend and frontend
 */
export const baseRules = {
  'no-console': 'off',
  'no-debugger': 'warn',
  'no-unused-vars': 'off',
  'no-empty': [
    'error',
    {
      allowEmptyCatch: true,
    },
  ],
  'no-undef': 'off',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
    },
  ],
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto',
    },
    { usePrettierrc: true },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      functions: false,
    },
  ],
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  // Consistent-type-imports OFF to match quickstart-aws-sql
  '@typescript-eslint/consistent-type-imports': [
    'off',
    {
      prefer: 'type-imports',
    },
  ],
};

