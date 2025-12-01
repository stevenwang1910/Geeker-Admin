import { ResPage, Dict } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 字典管理模块
 */
// 获取字典类型列表
export const getDictTypeList = (params: Dict.ReqDictTypeParams) => {
  return http.post<ResPage<Dict.ResDictTypeList>>(PORT1 + `/dict/type/list`, params);
};

// 新增字典类型
export const addDictType = (params: Dict.ResDictTypeList) => {
  return http.post(PORT1 + `/dict/type/add`, params);
};

// 编辑字典类型
export const editDictType = (params: Dict.ResDictTypeList) => {
  return http.post(PORT1 + `/dict/type/edit`, params);
};

// 删除字典类型
export const deleteDictType = (params: { id: string[] }) => {
  return http.post(PORT1 + `/dict/type/delete`, params);
};

// 切换字典类型状态
export const changeDictTypeStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/dict/type/change`, params);
};

// 导出字典类型数据
export const exportDictTypeInfo = (params: Dict.ReqDictTypeParams) => {
  return http.download(PORT1 + `/dict/type/export`, params);
};

// 获取字典项列表
export const getDictItemList = (params: Dict.ReqDictItemParams) => {
  return http.post<ResPage<Dict.ResDictItemList>>(PORT1 + `/dict/item/list`, params);
};

// 获取字典项树形列表
export const getDictItemTreeList = (params: { dictType: string }) => {
  return http.post<Dict.ResDictItemList[]>(PORT1 + `/dict/item/tree/list`, params);
};

// 新增字典项
export const addDictItem = (params: Dict.ResDictItemList) => {
  return http.post(PORT1 + `/dict/item/add`, params);
};

// 编辑字典项
export const editDictItem = (params: Dict.ResDictItemList) => {
  return http.post(PORT1 + `/dict/item/edit`, params);
};

// 删除字典项
export const deleteDictItem = (params: { id: string[] }) => {
  return http.post(PORT1 + `/dict/item/delete`, params);
};

// 切换字典项状态
export const changeDictItemStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/dict/item/change`, params);
};

// 导出字典项数据
export const exportDictItemInfo = (params: Dict.ReqDictItemParams) => {
  return http.download(PORT1 + `/dict/item/export`, params);
};

// 获取字典变更历史列表
export const getDictHistoryList = (params: { dictType: string; dictValue?: string }) => {
  return http.post<ResPage<Dict.ResDictHistoryList>>(PORT1 + `/dict/history/list`, params);
};

// 导入字典数据
export const importDictData = (params: FormData) => {
  return http.post(PORT1 + `/dict/import`, params);
};
