import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
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
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      ...baseIgnores,
      '**/public/**',
      'src/routeTree.gen.ts', // Auto-generated file
    ],
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...baseRules,
      // Additional frontend-specific rules
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-var-requires': 'off',
      
      // Type-only imports are safe in frontend (no runtime DI like NestJS)
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // React rules (preserved from .eslintrc.yml)
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
);

