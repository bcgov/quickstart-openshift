# Package Upgrade Notes

## @swc/cli Upgrade - Deferred

**Status:** Deferred until ecosystem compatibility improves

**Issue:** Renovate PR attempted to upgrade `@swc/cli` from `^0.7.0` to `^0.8.0`

### Why It Cannot Proceed

1. **@swc/cli@0.8.0** requires `chokidar@^5.0.0` as a peer dependency
2. **@nestjs/cli** latest version (11.0.16) only declares compatibility with `@swc/cli@^0.1-0.7.x`
3. No newer version of `@nestjs/cli` exists yet that supports `@swc/cli@0.8.0`

### Solution

Defer this upgrade until:
- `@nestjs/cli` releases a new version (v11.1.0, v12.0.0, etc.) that explicitly declares support for `@swc/cli@0.8.0`
- Then upgrade both `@nestjs/cli` and `@swc/cli` together

### Why Not Use Workarounds?

- ❌ `legacy-peer-deps=true`: Masks real incompatibilities, risks runtime failures
- ❌ Back-compatibility fixes: Would require downgrading `@swc/cli`, defeating the purpose
- ❌ Overrides without proper peer resolution: Creates brittle, non-reproducible builds

The proper approach is to wait for upstream library support.
