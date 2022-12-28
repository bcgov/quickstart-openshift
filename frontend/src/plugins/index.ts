/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";

// Types
import type { App } from "vue";
import router from "@/router";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(router);
}
