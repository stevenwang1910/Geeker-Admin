// SKU列表查询参数
export interface SkuListParams {
  product_id?: string | number; // 商品ID
  keyword?: string; // 关键词 (商品名称模糊搜索)
  status?: number; // 状态 (0: 停用, 1: 启用)
  page?: number; // 页码
  size?: number; // 每页条数
}

// SKU详情
export interface SkuDetail {
  id: string | number; // SKU ID
  sku_code: string; // SKU编码
  sku_name: string; // SKU名称
  product_id: string | number; // 所属商品ID
  product_name: string; // 所属商品名称
  status: number; // 状态 (0: 停用, 1: 启用)
  price: number; // 价格
  stock: number; // 库存
  sort: number; // 排序
  remark: string; // 备注
  spec_groups: SpecGroup[]; // 规格组列表
  sku_combinations: SkuCombination[]; // SKU组合列表
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
}

// 规格组
export interface SpecGroup {
  id: string | number; // 规格组ID
  group_name: string; // 规格组名称
  spec_values: SpecValue[]; // 规格值列表
}

// 规格值
export interface SpecValue {
  id: string | number; // 规格值ID
  value_name: string; // 规格值名称
}

// SKU组合
export interface SkuCombination {
  id: string | number; // 组合ID
  sku_id: string | number; // SKU ID
  spec_values: { [key: string]: string }; // 规格值组合 (key: 规格组名称, value: 规格值名称)
  price: number; // 价格
  stock: number; // 库存
  main_image: string; // 主图
}

// 创建/更新SKU参数
export interface SkuSaveParams {
  id?: string | number; // SKU ID (更新时必填)
  sku_code: string; // SKU编码
  sku_name: string; // SKU名称
  product_id: string | number; // 所属商品ID
  status: number; // 状态 (0: 停用, 1: 启用)
  sort: number; // 排序
  remark: string; // 备注
  spec_groups: SpecGroup[]; // 规格组列表
  sku_combinations: SkuCombination[]; // SKU组合列表
}
