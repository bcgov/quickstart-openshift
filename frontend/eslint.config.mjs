import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const baseIgnores = [
  '**/vite.config.*',
  '**/vitest.config.*',
  '**/playwright.config.*',
  '**/tsconfig*.json',
  '**/dist/**',
  '**/node_modules/**',
  '**/coverage/**',
];

export default defineConfig([
  {
    ignores: [
      ...baseIgnores,
      '**/public/**',
      'src/routeTree.gen.ts',
    ],
  },
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',

      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      'react/prop-types': 'off',
    },
  },
  prettierConfig,
]);
