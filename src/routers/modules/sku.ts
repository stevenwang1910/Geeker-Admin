import { RouteRecordRaw } from "vue-router";

/**
 * SKU管理模块路由
 */
const skuRoutes: RouteRecordRaw[] = [
  {
    path: "/sku",
    name: "sku",
    component: () => import("@/layouts/index.vue"),
    meta: {
      title: "SKU管理",
      icon: "Box"
    },
    children: [
      {
        path: "list",
        name: "skuList",
        component: () => import("@/views/sku/list/index.vue"),
        meta: {
          title: "SKU列表",
          icon: "List"
        }
      },
      {
        path: "edit/:id",
        name: "skuEdit",
        component: () => import("@/views/sku/edit/index.vue"),
        meta: {
          title: "SKU编辑",
          icon: "Edit",
          isHide: true
        }
      }
    ]
  }
];

export default skuRoutes;
