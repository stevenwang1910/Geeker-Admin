import type { RouteRecordRaw } from "vue-router";

const demoRouter: RouteRecordRaw[] = [
  {
    path: "/demo",
    name: "demo",
    component: () => import("@/views/demo/index.vue"),
    meta: {
      title: "Demo页面",
      icon: "example",
      roles: ["admin", "editor"]
    }
  }
];

export default demoRouter;