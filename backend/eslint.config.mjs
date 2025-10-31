import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { baseRules, baseIgnores } from '../eslint-base.config.mjs';

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

