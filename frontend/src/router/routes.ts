import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => {
      return import("../layouts/MainLayout.vue");
    },
  },
];

export default routes;
