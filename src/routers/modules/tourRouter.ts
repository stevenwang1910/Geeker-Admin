import { RouteRecordRaw } from "vue-router";

/**
 * tourRouter (引导页路由)
 */
export const tourRouter: RouteRecordRaw = {
  path: "/tour-config",
  name: "tourConfig",
  component: () => import("@/views/tour/index.vue"),
  meta: {
    title: "新手引导",
    icon: "tournament",
    isKeepAlive: false
  }
};
