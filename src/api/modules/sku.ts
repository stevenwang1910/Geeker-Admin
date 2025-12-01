import http from "@/api";
import { SkuListParams, SkuSaveParams } from "@/api/interface/sku";
import { PORT1 } from "@/api/config/servicePort";

/**
 * @description 获取SKU列表
 * @param params {SkuListParams} 查询参数
 * @returns {Promise<any>}
 */
export const getSkuList = (params: SkuListParams): Promise<any> => {
  return http.get(PORT1 + "/sku/list", params);
};

/**
 * @description 获取SKU详情
 * @param id {string | number} SKU ID
 * @returns {Promise<any>}
 */
export const getSkuDetail = (id: string | number): Promise<any> => {
  return http.get(PORT1 + `/sku/${id}`);
};

/**
 * @description 创建/更新SKU
 * @param params {SkuSaveParams} SKU数据
 * @returns {Promise<any>}
 */
export const saveSku = (params: SkuSaveParams): Promise<any> => {
  return http.post(PORT1 + `/sku/save`, params);
};

/**
 * @description 删除SKU
 * @param id {string | number} SKU ID
 * @returns {Promise<any>}
 */
export const deleteSku = (id: string | number): Promise<any> => {
  return http.delete(PORT1 + `/sku/${id}`);
};

/**
 * @description 切换SKU状态
 * @param id {string | number} SKU ID
 * @param status {number} 状态值 (0: 停用, 1: 启用)
 * @returns {Promise<any>}
 */
export const switchSkuStatus = (id: string | number, status: number): Promise<any> => {
  return http.post(PORT1 + `/sku/${id}/status`, { status });
};
