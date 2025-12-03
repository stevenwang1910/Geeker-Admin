import { http } from "@/api/config";
import { ResultData, ResPage } from "@/api/interface";

// 获取demo列表
export const getDemoList = (params: any): Promise<ResultData<ResPage<any>>> => {
  return http.post({ url: "/demo/list", params });
};

// 新增demo
export const addDemo = (params: any): Promise<ResultData<any>> => {
  return http.post({ url: "/demo/add", params });
};

// 编辑demo
export const editDemo = (params: any): Promise<ResultData<any>> => {
  return http.post({ url: "/demo/edit", params });
};

// 删除demo
export const deleteDemo = (params: any): Promise<ResultData<any>> => {
  return http.post({ url: "/demo/delete", params });
};

// 导出demo信息
export const exportDemoInfo = (params: any): Promise<ResultData<any>> => {
  return http.post({ url: "/demo/export", params, responseType: "blob" });
};