import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts", "**/*.spec.ts"],
    exclude: ["**/node_modules/**"],
    globals: true,
    environment: "node",
    setupFiles: "test/test-setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["lcov"],
    },
  },
  plugins: [swc.vite()],
});
