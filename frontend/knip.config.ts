import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [ 'src/routeTree.gen.ts' ],
  ignoreExportsUsedInFile: true,
  workspaces: {
    '.': {
      entry: [ 'src/main.tsx', 'src/test-utils.tsx' ],
      project: [ 'src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.spec.{ts,tsx}' ],
      ignore: [
        // Auto-generated route tree file - types are used by TanStack Router internally
        'src/routeTree.gen.ts',
      ],
    },
  },
  // Vite aliases like ~bootstrap are resolved at build time, not by Knip
  // This import is valid and works at runtime
  ignoreUnresolved: [ '~bootstrap' ],
}

export default config
