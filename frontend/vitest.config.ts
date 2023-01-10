import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import viteConfig from "./vite.config";
import { mergeConfig } from "vite";
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: { provider: "istanbul" },
      globals: true,
      setupFiles: "vuetify.config.js",
      deps: {
        inline: ["vuetify"],
      },

      environment: "jsdom",
    },
    optimizeDeps: {},
  })
);
