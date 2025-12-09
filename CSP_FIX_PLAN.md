# CSP Fix Plan - Systematic Approach

## Problem
58 CSP violations from inline styles in `index-*.js:10`. We've removed react-bootstrap but violations persist.

## Root Cause Analysis Plan

### Step 1: Identify the Source
The errors point to `index-Bf2rhuza.js:10`. We need to:
1. **Build locally and inspect the bundle**
   - Build: `cd frontend && npm run build`
   - Search the built JS file for `.style` or `setProperty` calls
   - Identify which library/component is generating inline styles

### Step 2: Likely Culprits (Priority Order)

#### A. react-aria-components
- **Why**: Used by BCGov design-system, known to use inline styles
- **Check**: Search for `style=` or `style.setProperty` in react-aria-components source
- **Fix**: If confirmed, we need to either:
  - Patch react-aria-components to not use inline styles
  - Find a CSP-compliant alternative
  - Use a CSP proxy/interceptor to convert inline styles to classes

#### B. BCGov Design System Components
- **Why**: Header/Footer might internally use components that inject styles
- **Check**: Inspect the built BCGov bundle for inline style usage
- **Fix**: Work with BCGov team or patch the fork

#### C. Bootstrap JavaScript (if we're using it)
- **Why**: Bootstrap JS sometimes injects inline styles for modals/tooltips
- **Check**: We're NOT importing Bootstrap JS (good!), but verify
- **Fix**: Not applicable (we don't use Bootstrap JS)

### Step 3: Immediate Diagnostic Actions

1. **Create a minimal test page** without BCGov components
   - Temporarily remove Header/Footer
   - Check if violations go away
   - This isolates whether BCGov components are the source

2. **Build and inspect the bundle**
   - Run: `cd frontend && npm run build`
   - Open `dist/index-*.js` in editor
   - Search for: `style=`, `.style`, `setProperty`, `style-src`
   - Look at line 10 or nearby for style manipulation

3. **Browser console inspection**
   - Open the deployed site
   - In console, expand one of the CSP errors
   - Click the file link to see source mapping
   - Identify the actual component/library causing it

### Step 4: Fix Strategy

#### Option A: If react-aria-components is the problem
1. Create a Vite plugin to intercept and convert inline styles to CSS classes
2. OR: Fork/patch react-aria-components to not use inline styles
3. OR: Replace BCGov components that use react-aria-components

#### Option B: If BCGov components are the problem
1. Check our fork - are we using the right branch?
2. Inspect the built BCGov bundle in `/tmp/bcgov-design-system/packages/react-components/dist/`
3. Search for inline style usage
4. Fix in our fork and test

#### Option C: Runtime style interceptor (temporary)
1. Create a script that runs before React renders
2. Intercepts `element.style.setProperty` calls
3. Converts them to CSS classes dynamically
4. This is a workaround, not a permanent fix

## Next Immediate Steps

1. **Build locally and inspect**
   ```bash
   cd frontend
   npm run build
   grep -r "\.style\|setProperty" dist/
   ```

2. **Create minimal test** - Remove Header/Footer temporarily to isolate

3. **Check browser source maps** - Use devtools to find exact source

4. **Report findings** - Once we identify the source, we can fix it properly

