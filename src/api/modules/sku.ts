import http from "@/api";
import { SkuListParams, SkuDetailParams, SkuSaveParams, SkuStatusParams } from "@/api/interface";

/**
 * 获取SKU列表
 * @param params 查询参数
 * @returns SKU列表数据
 */
export const getSkuList = (params: SkuListParams) => {
  return http.get("/api/sku/list", params);
};

/**
 * 获取SKU详情
 * @param params SKU ID
 * @returns SKU详情数据
 */
export const getSkuDetail = (params: SkuDetailParams) => {
  return http.get(`/api/sku/${params.id}`);
};

/**
 * 创建/更新SKU
 * @param params SKU数据
 * @returns 操作结果
 */
export const saveSku = (params: SkuSaveParams) => {
  return http.post("/api/sku/save", params);
};

/**
 * 删除SKU
 * @param params SKU ID
 * @returns 操作结果
 */
export const deleteSku = (params: SkuDetailParams) => {
  return http.delete(`/api/sku/${params.id}`);
};

/**
 * 切换SKU状态
 * @param params SKU ID和状态
 * @returns 操作结果
 */
export const switchSkuStatus = (params: SkuStatusParams) => {
  return http.post(`/api/sku/${params.id}/status`, { status: params.status });
};
