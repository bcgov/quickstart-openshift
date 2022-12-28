import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => {
      return import("../views/Dashboard.vue");
    },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => {
      return import("../views/NotFound.vue");
    },
  },
];

export default routes;
