import { Goods } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 商品模块
 */
// 获取商品列表
export const getGoodsList = (params: Goods.ReqGoodsList) => {
  return http.get<Goods.ResGoodsList>(PORT1 + `/goods/list`, params);
};

// 批量导入商品
export const batchImportGoods = (params: FormData) => {
  return http.post(PORT1 + `/goods/batchImport`, params, { headers: { "Content-Type": "multipart/form-data" } });
};

// 批量导出商品
export const batchExportGoods = (params: string[]) => {
  return http.post(PORT1 + `/goods/batchExport`, params, { responseType: "blob" });
};

// 更新商品
export const updateGoods = (params: Goods.ReqUpdateGoods) => {
  return http.put(PORT1 + `/goods/update`, params);
};

// 获取商品详情
export const getGoodsDetail = (params: string) => {
  return http.get<Goods.ResGoodsDetail>(PORT1 + `/goods/detail/${params}`);
};
