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

// 导出部门数据
export const exportDepartmentInfo = (params: Department.ReqDepartmentParams) => {
  return http.download(PORT1 + `/department/export`, params);
};

// 检查部门名称是否唯一
export const checkDepartmentNameUnique = (params: { name: string; parentId?: string }) => {
  return http.post(PORT1 + `/department/check/name`, params);
};

// 检查部门编码是否唯一
export const checkDepartmentCodeUnique = (params: { code: string }) => {
  return http.post(PORT1 + `/department/check/code`, params);
};
