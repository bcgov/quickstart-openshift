import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreExportsUsedInFile: true,
  workspaces: {
    '.': {
      entry: [ 'src/main.ts' ],
      project: [ 'src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts' ],
    },
  },
}

export default config
