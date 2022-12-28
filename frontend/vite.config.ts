import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    vue(),

    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: {"process.env": {}},
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue",".css"],
  },
});
