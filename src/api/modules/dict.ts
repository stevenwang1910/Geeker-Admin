import { ResPage, Dict } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import dictList from "@/assets/json/dictList.json";
import dictItemList from "@/assets/json/dictItemList.json";

/**
 * @name 字典管理模块
 */
// 获取字典类型列表
export const getDictTypeList = (params: Dict.ReqDictTypeParams) => {
  // 先返回本地mock数据
  return Promise.resolve(dictList);
  // return http.post<ResPage<Dict.ResDictTypeList>>(PORT1 + `/dict/type/list`, params);
};

// 获取字典类型详情
export const getDictTypeDetail = (params: { id: string }) => {
  return http.get<Dict.ResDictTypeList>(PORT1 + `/dict/type/detail`, { params });
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

// 获取字典项列表
export const getDictItemList = (params: Dict.ReqDictItemParams) => {
  // 先返回本地mock数据
  return Promise.resolve(dictItemList);
  // return http.post<ResPage<Dict.ResDictItemList>>(PORT1 + `/dict/item/list`, params);
};

// 获取字典项树形列表
export const getDictItemTreeList = (params: { dictId: string }) => {
  return http.get<Dict.ResDictItemList[]>(PORT1 + `/dict/item/tree/list`, { params });
};

// 获取字典项详情
export const getDictItemDetail = (params: { id: string }) => {
  return http.get<Dict.ResDictItemList>(PORT1 + `/dict/item/detail`, { params });
};

// 新增字典项
export const addDictItem = (params: Dict.ResDictItemList) => {
  // return http.post(PORT1 + `/dict/item/add`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: null });
};

// 编辑字典项
export const editDictItem = (params: Dict.ResDictItemList) => {
  // return http.post(PORT1 + `/dict/item/edit`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: null });
};

// 删除字典项
export const deleteDictItem = (params: { id: string[] }) => {
  // return http.post(PORT1 + `/dict/item/delete`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: null });
};

// 切换字典项状态
export const changeDictItemStatus = (params: { id: string; status: number }) => {
  // return http.post(PORT1 + `/dict/item/change`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: null });
};

// 导出字典数据
export const exportDictData = (params: Dict.ReqDictTypeParams) => {
  // return http.download(PORT1 + `/dict/export`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: new Blob([JSON.stringify(dictList)]) });
};

// 导入字典数据
export const importDictData = (params: FormData) => {
  // return http.post(PORT1 + `/dict/import`, params);
  return Promise.resolve({ code: 200, msg: "导入成功", data: null });
};

// 获取字典变更历史
export const getDictHistoryList = (params: ReqPage) => {
  // return http.post<ResPage<Dict.ResDictHistory>>(PORT1 + `/dict/history/list`, params);
  return Promise.resolve({ code: 200, msg: "操作成功", data: { list: [], pageNum: 1, pageSize: 10, total: 0 } });
};
