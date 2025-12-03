import { defHttp } from '@/api/helper/axios';

// 菜单管理API

// 获取菜单列表
export const getMenuList = (params?: any) => {
  return defHttp.get({ url: '/menu/list', params });
};

// 新增菜单
export const addMenu = (data: any) => {
  return defHttp.post({ url: '/menu/add', data });
};

// 编辑菜单
export const editMenu = (data: any) => {
  return defHttp.post({ url: '/menu/edit', data });
};

// 删除菜单
export const deleteMenu = (data: any) => {
  return defHttp.post({ url: '/menu/delete', data });
};

// 批量删除菜单
export const batchDeleteMenu = (data: any) => {
  return defHttp.post({ url: '/menu/batch/delete', data });
};