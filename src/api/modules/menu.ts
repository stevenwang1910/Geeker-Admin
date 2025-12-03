import http from "@/api";
import { ResPage } from "@/api/interface";

/**
 * 菜单相关接口
 */
export namespace Menu {
  export interface ReqMenuParams {
    id?: string;
    menuName?: string;
    path?: string;
    component?: string;
    perm?: string;
    type?: string;
    sort?: number;
    parentId?: string;
    meta?: {
      title?: string;
      icon?: string;
      isKeepAlive?: boolean;
      isAffix?: boolean;
      isHide?: boolean;
    };
  }

  export interface ResMenuList {
    id: string;
    menuName: string;
    path: string;
    component: string;
    perm: string;
    type: string;
    sort: number;
    parentId: string;
    createTime: string;
    updateTime: string;
    children?: ResMenuList[];
    meta: {
      title: string;
      icon: string;
      isKeepAlive: boolean;
      isAffix: boolean;
      isHide: boolean;
    };
  }

  /** 获取菜单列表 */
  export const getMenuList = (params?: ReqMenuParams) => {
    return http.get<ResPage<ResMenuList[]>>(`/menu/list`, params);
  };

  /** 新增菜单 */
  export const addMenu = (params: ReqMenuParams) => {
    return http.post(`/menu/add`, params);
  };

  /** 编辑菜单 */
  export const editMenu = (params: ReqMenuParams) => {
    return http.put(`/menu/edit`, params);
  };

  /** 删除菜单 */
  export const deleteMenu = (params: { ids: string[] }) => {
    return http.delete(`/menu/delete`, params);
  };
}
