import { ResPage, ResultData } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 角色管理模块
 */
// 角色相关数据类型
export namespace Role {
  // 角色列表请求参数
  export interface ReqRoleParams {
    pageNum: number;
    pageSize: number;
    name?: string;
    status?: number;
  }

  // 角色列表响应数据
  export interface ResRoleList {
    id: string;
    name: string;
    description: string;
    status: number;
    createTime: string;
  }

  // 角色表单数据
  export interface RoleForm {
    id?: string;
    name: string;
    description: string;
    status: number;
  }

  // 权限树响应数据
  export interface ResPermissionTree {
    id: string;
    name: string;
    children?: ResPermissionTree[];
  }

  // 角色成员列表请求参数
  export interface ReqRoleMembersParams {
    roleId: string;
    pageNum: number;
    pageSize: number;
    keyword?: string;
  }

  // 角色成员列表响应数据
  export interface ResRoleMembersList {
    id: string;
    username: string;
    name: string;
    email: string;
    status: number;
  }

  // 添加成员到角色请求参数
  export interface ReqAddMembersToRole {
    roleId: string;
    userIds: string[];
  }

  // 从角色中移除成员请求参数
  export interface ReqRemoveMemberFromRole {
    roleId: string;
    userId: string;
  }

  // 分配权限到角色请求参数
  export interface ReqAssignPermissionsToRole {
    roleId: string;
    permissions: string[];
  }
}

// 获取角色列表
export const getRoleList = (params: Role.ReqRoleParams) => {
  return http.post<ResPage<Role.ResRoleList>>(PORT1 + `/role/list`, params);
};

// 新增角色
export const addRole = (params: Role.RoleForm) => {
  return http.post<ResultData>(PORT1 + `/role/add`, params);
};

// 编辑角色
export const editRole = (params: Role.RoleForm) => {
  return http.post<ResultData>(PORT1 + `/role/edit`, params);
};

// 删除角色
export const deleteRole = (params: { id: string[] }) => {
  return http.post<ResultData>(PORT1 + `/role/delete`, params);
};

// 切换角色状态
export const changeRoleStatus = (params: { id: string; status: number }) => {
  return http.post<ResultData>(PORT1 + `/role/change`, params);
};

// 获取权限树
export const getPermissionTree = () => {
  return http.get<Role.ResPermissionTree[]>(PORT1 + `/permission/tree`);
};

// 获取角色已分配的权限
export const getRolePermissions = (params: { roleId: string }) => {
  return http.get<string[]>(PORT1 + `/role/permissions`, params);
};

// 分配权限到角色
export const assignPermissionsToRole = (params: Role.ReqAssignPermissionsToRole) => {
  return http.post<ResultData>(PORT1 + `/role/assignPermissions`, params);
};

// 获取角色成员列表
export const getRoleMembers = (params: Role.ReqRoleMembersParams) => {
  return http.post<ResPage<Role.ResRoleMembersList>>(PORT1 + `/role/members`, params);
};

// 获取可添加到角色的成员列表
export const getAddMembersList = (params: Role.ReqRoleMembersParams) => {
  return http.post<ResPage<Role.ResRoleMembersList>>(PORT1 + `/role/addMembersList`, params);
};

// 添加成员到角色
export const addMembersToRole = (params: Role.ReqAddMembersToRole) => {
  return http.post<ResultData>(PORT1 + `/role/addMembers`, params);
};

// 从角色中移除成员
export const removeMemberFromRole = (params: Role.ReqRemoveMemberFromRole) => {
  return http.post<ResultData>(PORT1 + `/role/removeMember`, params);
};
