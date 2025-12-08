# Testing BCGov CSP Fix Branch

This PR is prepared to test the BCGov design system CSP fix from branch `574-feat-replace-inline-styles-csp-compliance`.

## Manual Installation Required

Since `@bcgov/design-system-react-components` is in a monorepo subdirectory (`packages/react-components`), npm cannot install it directly from a git branch. Manual steps are required:

### Option 1: Local Build and Link (Recommended)

1. Clone the BCGov design system repo:
   ```bash
   git clone --branch 574-feat-replace-inline-styles-csp-compliance https://github.com/bcgov/design-system.git /tmp/bcgov-design-system
   cd /tmp/bcgov-design-system/packages/react-components
   npm install
   npm run rollup
   ```

2. Link the local package:
   ```bash
   npm link
   ```

3. In this repository's frontend directory:
   ```bash
   cd frontend
   npm link @bcgov/design-system-react-components
   npm install
   ```

### Option 2: Wait for Pre-release

Request the BCGov team to publish a pre-release version (e.g., `0.5.3-beta.1`) that can be installed via npm.

### Option 3: Temporary Package.json Override

Temporarily modify `frontend/package.json`:
```json
"@bcgov/design-system-react-components": "file:/path/to/bcgov-design-system/packages/react-components"
```

## Testing Checklist

Once installed, verify:
- [ ] CSP violations are eliminated or significantly reduced
- [ ] Header/Footer components render correctly
- [ ] Visual appearance is unchanged
- [ ] No console errors (except possibly unrelated ones)
- [ ] Application functionality works as expected

## Related

- BCGov Issue: https://github.com/bcgov/design-system/issues/574
- BCGov Branch: https://github.com/bcgov/design-system/tree/574-feat-replace-inline-styles-csp-compliance
- Original Diagnostic PR: https://github.com/bcgov/quickstart-openshift/pull/2549

