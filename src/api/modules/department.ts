import { ResPage, Department } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 部门管理模块
 */
// 获取部门列表
export const getDepartmentList = (params: Department.ReqDepartmentParams) => {
  return http.post<ResPage<Department.ResDepartmentList>>(PORT1 + `/department/list`, params);
};

// 获取树形部门列表
export const getDepartmentTreeList = (params: Department.ReqDepartmentParams) => {
  return http.post<ResPage<Department.ResDepartmentList>>(PORT1 + `/department/tree/list`, params);
};

// 新增部门
export const addDepartment = (params: Department.ReqAddDepartment) => {
  return http.post(PORT1 + `/department/add`, params);
};

// 批量添加部门
export const batchAddDepartment = (params: FormData) => {
  return http.post(PORT1 + `/department/import`, params);
};

// 编辑部门
export const editDepartment = (params: Department.ReqEditDepartment) => {
  return http.post(PORT1 + `/department/edit`, params);
};

// 删除部门
export const deleteDepartment = (params: { id: string[] }) => {
  return http.post(PORT1 + `/department/delete`, params);
};

// 切换部门状态
export const changeDepartmentStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/department/change`, params);
};

// 导出部门数据
export const exportDepartmentInfo = (params: Department.ReqDepartmentParams) => {
  return http.download(PORT1 + `/department/export`, params);
};

// 获取部门状态字典
export const getDepartmentStatus = () => {
  return http.get<Department.ResStatus[]>(PORT1 + `/department/status`);
};

// 获取部门类型字典
export const getDepartmentType = () => {
  return http.get<Department.ResType[]>(PORT1 + `/department/type`);
};

// 校验部门名称唯一性
export const checkDepartmentNameUnique = (params: { name: string; parentId?: string; id?: string }) => {
  return http.post<{ isUnique: boolean }>(PORT1 + `/department/check/name`, params);
};

// 校验部门编码唯一性
export const checkDepartmentCodeUnique = (params: { code: string; parentId?: string; id?: string }) => {
  return http.post<{ isUnique: boolean }>(PORT1 + `/department/check/code`, params);
};

// 校验部门编码格式合法性
export const checkDepartmentCodeFormat = (params: { code: string }) => {
  return http.post<{ isValid: boolean }>(PORT1 + `/department/check/code/format`, params);
};

// 校验父子部门关系有效性
export const checkDepartmentParentValid = (params: { parentId: string; id?: string }) => {
  return http.post<{ isValid: boolean }>(PORT1 + `/department/check/parent`, params);
};
