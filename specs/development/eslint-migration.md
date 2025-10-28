# ESLint Migration Specification

## Overview
Migrate from legacy ESLint configurations (Airbnb, custom configs) to modern TypeScript ESLint with flat config format across both backend and frontend applications.

## Goals
- ✅ Drop Airbnb configuration
- ✅ Use modern TypeScript ESLint 8.x with flat config
- ✅ Maintain minimal changes approach
- ✅ Ensure compatibility with existing tooling
- ✅ Fix SonarCloud coverage issues

## Requirements

### Functional Requirements
- Migrate backend from legacy ESLint to modern flat config
- Migrate frontend from legacy ESLint to modern flat config
- Maintain all existing linting rules and functionality
- Ensure compatibility with existing CI/CD pipeline
- Fix SonarCloud coverage reporting issues

### Technical Requirements
- Use ESLint 9.x with flat config format
- Use TypeScript ESLint 8.x for TypeScript support
- Maintain Prettier integration
- Support React-specific rules for frontend
- Exclude auto-generated files from coverage

### Non-Functional Requirements
- Zero breaking changes to existing codebase
- Improved developer experience
- Faster linting performance
- Better IDE integration
- Consistent code formatting

## Key Learnings

### 1. Dependency Management
- **Problem**: Legacy configs expect ESLint 7.x/8.x, causing ERESOLVE conflicts with ESLint 9.x
- **Solution**: Remove ALL legacy dependencies before installing new ones
- **Critical**: Use `npm ci --legacy-peer-deps` only as temporary workaround

### 2. Configuration Approach
- **Minimal Config**: Start with basic recommended configs, add rules incrementally
- **Flat Config**: Use `eslint.config.mjs` instead of `.eslintrc.*` files
- **TypeScript Integration**: Include both `tsconfig.json` and `tsconfig.node.json` for frontend

### 3. Coverage Issues
- **Problem**: SonarCloud flags auto-generated files for coverage
- **Solution**: Use `/* c8 ignore file */` and `/* istanbul ignore file */` comments
- **Vitest Config**: Exclude auto-generated files in coverage configuration

### 4. Cursor Integration
- **Problem**: Cursor auto-formatting conflicts with ESLint/Prettier
- **Solution**: Ensure consistent formatting rules and run `npm run lint --fix`
- **Critical**: Test auto-save behavior before committing

## Implementation Plan

### Phase 1: Backend Migration
1. **Update Dependencies**
   ```json
   {
     "devDependencies": {
       "@typescript-eslint/eslint-plugin": "^8.46.2",
       "@typescript-eslint/parser": "^8.46.2",
       "eslint": "^9.38.0",
       "@eslint/js": "^9.38.0",
       "typescript-eslint": "^8.46.2",
       "eslint-config-prettier": "^10.1.8",
       "eslint-plugin-prettier": "^5.2.3",
       "prettier": "^3.5.3"
     }
   }
   ```

2. **Create ESLint Config**
   ```javascript
   // backend/eslint.config.mjs
   import eslint from '@eslint/js';
   import tseslint from 'typescript-eslint';

   export default tseslint.config(
     eslint.configs.recommended,
     ...tseslint.configs.recommended,
     {
       files: ['**/*.ts', '**/*.tsx'],
       ignores: ['**/*.config.*', '**/dist/**', '**/node_modules/**'],
     },
   );
   ```

3. **Remove Legacy Files**
   - Delete `.eslintrc.yml` (if exists)
   - Delete `.eslintignore` (if exists)

### Phase 2: Frontend Migration
1. **Update Dependencies**
   ```json
   {
     "devDependencies": {
       "eslint": "^9.38.0",
       "@eslint/js": "^9.38.0",
       "typescript-eslint": "^8.46.2",
       "eslint-config-prettier": "^10.1.8",
       "eslint-plugin-prettier": "^5.2.3",
       "eslint-plugin-react": "^7.37.4",
       "eslint-plugin-react-hooks": "^5.2.0"
     }
   }
   ```

2. **Create ESLint Config**
   ```javascript
   // frontend/eslint.config.mjs
   import eslint from '@eslint/js';
   import tseslint from 'typescript-eslint';
   import react from 'eslint-plugin-react';
   import reactHooks from 'eslint-plugin-react-hooks';

   export default tseslint.config(
     eslint.configs.recommended,
     ...tseslint.configs.recommended,
     {
       files: ['**/*.ts', '**/*.tsx'],
       ignores: ['**/*.config.*', '**/dist/**', '**/node_modules/**'],
       plugins: {
         react,
         'react-hooks': reactHooks,
       },
       settings: {
         react: {
           version: 'detect',
         },
       },
       rules: {
         ...react.configs.recommended.rules,
         ...reactHooks.configs.recommended.rules,
         'react/jsx-uses-react': 'off',
         'react/react-in-jsx-scope': 'off',
       },
     },
   );
   ```

3. **Add Lint Script**
   ```json
   {
     "scripts": {
       "lint": "eslint \"src/**/*.{ts,tsx}\" --fix"
     }
   }
   ```

### Phase 3: Coverage Fixes
1. **Update Vitest Config**
   ```typescript
   // frontend/vitest.config.ts
   coverage: {
     exclude: [
       '**/node_modules/**',
       '**/dist/**',
       '**/coverage/**',
       '**/*.config.*',
       'src/routeTree.gen.ts',  // Auto-generated file
       'src/**/*.test.ts',
       'src/**/*.spec.ts',
       'src/**/*.test.tsx',
       'src/**/*.spec.tsx',
       'src/__tests__/**',
     ],
   }
   ```

2. **Add Coverage Comments**
   ```typescript
   // frontend/src/routeTree.gen.ts
   /* eslint-disable */
   /* c8 ignore file */
   /* istanbul ignore file */
   // ... rest of file
   ```

## Success Criteria
- ✅ No dependency conflicts
- ✅ Linting works consistently
- ✅ Coverage issues resolved
- ✅ Minimal code changes required
- ✅ Cursor integration works smoothly

## Testing Checklist
- [ ] `npm install` completes without ERESOLVE errors
- [ ] `npm run lint` works in both backend and frontend
- [ ] `npm run test:cov` excludes auto-generated files
- [ ] Cursor auto-save doesn't conflict with linting
- [ ] SonarCloud coverage passes
- [ ] All existing tests still pass

## Rollback Plan
If issues arise:
1. Revert package.json changes
2. Restore original ESLint config files
3. Run `npm install` to restore previous state

## Notes
- **Critical**: Test each phase independently
- **Avoid**: Complex rule configurations initially
- **Focus**: Minimal viable migration first
- **Validate**: Auto-save behavior before committing

## Dependencies
- Backend: NestJS, TypeScript, Prisma
- Frontend: React, TypeScript, Vite
- Tooling: ESLint, Prettier, Vitest, SonarCloud
- CI/CD: GitHub Actions, OpenShift
