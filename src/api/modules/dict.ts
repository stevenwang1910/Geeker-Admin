import { Dict } from "@/api/interface/index";
import {
  mockGetDictTypeList,
  mockAddDictType,
  mockEditDictType,
  mockDeleteDictType,
  mockChangeDictTypeStatus,
  mockGetDictItemList,
  mockGetDictItemTreeList,
  mockAddDictItem,
  mockEditDictItem,
  mockDeleteDictItem,
  mockChangeDictItemStatus,
  mockImportDictData,
  mockExportDictData,
  mockGetDictHistory,
  mockGetDictPermission,
  mockSetDictPermission,
  mockGetAllDictTypes,
  mockGetDictItemsByType
} from "./dict.mock";

/**
 * @name 字典管理模块
 */

// 获取字典类型列表
export const getDictTypeList = (params: Dict.ReqDictTypeParams) => {
  return mockGetDictTypeList(params);
};

// 新增字典类型
export const addDictType = (params: Dict.ReqAddDictType) => {
  return mockAddDictType(params);
};

// 编辑字典类型
export const editDictType = (params: Dict.ReqEditDictType) => {
  return mockEditDictType(params);
};

// 删除字典类型
export const deleteDictType = (params: { id: string[] }) => {
  return mockDeleteDictType(params);
};

// 切换字典类型状态
export const changeDictTypeStatus = (params: { id: string; status: number }) => {
  return mockChangeDictTypeStatus(params);
};

// 获取字典项列表
export const getDictItemList = (params: Dict.ReqDictItemParams) => {
  return mockGetDictItemList(params);
};

// 获取字典项树形列表
export const getDictItemTreeList = (params: { typeId: string }) => {
  return mockGetDictItemTreeList(params);
};

// 新增字典项
export const addDictItem = (params: Dict.ReqAddDictItem) => {
  return mockAddDictItem(params);
};

// 编辑字典项
export const editDictItem = (params: Dict.ReqEditDictItem) => {
  return mockEditDictItem(params);
};

// 删除字典项
export const deleteDictItem = (params: { id: string[] }) => {
  return mockDeleteDictItem(params);
};

// 切换字典项状态
export const changeDictItemStatus = (params: { id: string; status: number }) => {
  return mockChangeDictItemStatus(params);
};

// 导入字典数据
export const importDictData = (params: FormData) => {
  return mockImportDictData(params);
};

// 导出字典数据
export const exportDictData = (params: { typeId?: string }) => {
  return mockExportDictData(params);
};

// 获取字典变更历史
export const getDictHistory = (params: Dict.ReqDictHistoryParams) => {
  return mockGetDictHistory(params);
};

// 获取字典权限列表
export const getDictPermission = (params: { dictId: string }) => {
  return mockGetDictPermission(params);
};

// 设置字典权限
export const setDictPermission = (params: Dict.ReqSetDictPermission) => {
  return mockSetDictPermission(params);
};

// 获取所有字典类型（用于下拉选择）
export const getAllDictTypes = () => {
  return mockGetAllDictTypes();
};

// 根据字典类型获取字典项（用于下拉选择）
export const getDictItemsByType = (params: { typeCode: string }) => {
  return mockGetDictItemsByType(params);
};
