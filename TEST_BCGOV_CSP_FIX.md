# Testing BCGov CSP Fix Branch

This PR tests the BCGov design system CSP fix from branch `574-refactor-bc-logo-icon` (PR #577).

## CI/CD Integration

The Dockerfile has been modified to automatically clone and build the BCGov CSP fix branch during the Docker build process. This means:
- ✅ Works in OpenShift CI/CD pipelines
- ✅ PR deployments will automatically use the CSP fix branch
- ✅ No manual installation required for deployed environments

## Local Development Setup

### Option 1: Local Build and Link (Recommended)

1. Clone the BCGov design system repo:
   ```bash
   git clone --branch 574-refactor-bc-logo-icon https://github.com/bcgov/design-system.git /tmp/bcgov-design-system
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

### Option 3: Use Docker Build (Same as CI/CD)

The Dockerfile automatically handles building the BCGov package, so local Docker builds will use the CSP fix branch automatically.

## Testing Checklist

Once installed, verify:
- [ ] CSP violations are eliminated or significantly reduced
- [ ] Header/Footer components render correctly
- [ ] Visual appearance is unchanged
- [ ] No console errors (except possibly unrelated ones)
- [ ] Application functionality works as expected

## Related

- BCGov Issue: https://github.com/bcgov/design-system/issues/574
- BCGov Branch: https://github.com/bcgov/design-system/tree/574-refactor-bc-logo-icon
- BCGov PR: https://github.com/bcgov/design-system/pull/577
- Original Diagnostic PR: https://github.com/bcgov/quickstart-openshift/pull/2549

