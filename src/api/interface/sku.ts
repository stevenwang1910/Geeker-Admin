// SKU管理模块接口定义

// SKU基础信息
export interface SkuBase {
  id?: string;
  skuCode: string; // SKU编码
  skuName: string; // SKU名称
  productId: string; // 所属商品ID
  productName: string; // 所属商品名称
  status: number; // 状态 0:停用 1:启用
  sort: number; // 排序
  remark: string; // 备注
  price: number; // 价格
  stock: number; // 库存
  image?: string; // 图片
  specValues?: Record<string, string>; // 规格值键值对
}

// SKU规格组
export interface SpecGroup {
  id?: string;
  name: string; // 规格组名称
  values: SpecValue[]; // 规格值列表
}

// SKU规格值
export interface SpecValue {
  id?: string;
  name: string; // 规格值名称
}

// SKU完整信息（包含规格配置）
export interface SkuFull extends SkuBase {
  specGroups: SpecGroup[]; // 规格组配置
  skuCombinations: SkuCombination[]; // SKU组合列表
}

// SKU组合项
export interface SkuCombination extends SkuBase {
  specValues: Record<string, string>; // 规格值键值对，如 {"颜色":"红色","容量":"128G"}
}

// SKU查询参数
export interface ReqSkuParams {
  pageNum: number;
  pageSize: number;
  productId?: string;
  keyword?: string;
  status?: number;
  skuCode?: string;
}

// SKU保存参数
export interface ReqSkuSave extends SkuFull {
  // 继承所有字段
}

// SKU状态切换参数
export interface ReqSkuStatus {
  id: string;
  status: number;
}

// SKU删除参数
export interface ReqSkuDelete {
  id: string;
}
