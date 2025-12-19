// Knip configuration - used by external CI/CD tools, not part of application dependencies
const config = {
  ignoreExportsUsedInFile: true,
  workspaces: {
    '.': {
      entry: [ 'src/main.ts' ],
      project: [ 'src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts' ],
    },
  },
}

export default config
