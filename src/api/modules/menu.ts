import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 菜单管理模块
 */
// 获取菜单列表
export const getMenuList = (params?: any) => {
  return http.post(PORT1 + `/menu/list`, params);
};

// 新增菜单
export const addMenu = (params: any) => {
  return http.post(PORT1 + `/menu/add`, params);
};

// 编辑菜单
export const editMenu = (params: any) => {
  return http.post(PORT1 + `/menu/edit`, params);
};

// 删除菜单
export const deleteMenu = (params: { id: string[] }) => {
  return http.post(PORT1 + `/menu/delete`, params);
};

// 搜索菜单
export const searchMenu = (params: any) => {
  return http.post(PORT1 + `/menu/search`, params);
};