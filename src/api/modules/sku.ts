import { ResPage } from "@/api/interface/index";
import { SkuBase, SkuFull, ReqSkuParams } from "@/api/interface/sku";

/**
 * @name SKU管理模块
 */

// 获取SKU列表
export const getSkuList = (params: ReqSkuParams) => {
  // 模拟数据
  const mockData: ResPage<SkuBase> = {
    list: [
      {
        id: "1",
        skuCode: "SKU001",
        skuName: "iPhone 15 Pro 256G 原色钛金属",
        productId: "P001",
        productName: "iPhone 15 Pro",
        status: 1,
        price: 9999,
        stock: 100,
        sort: 1,
        remark: "热销款",
        specValues: { 颜色: "原色钛金属", 容量: "256G" }
      },
      {
        id: "2",
        skuCode: "SKU002",
        skuName: "iPhone 15 Pro 512G 原色钛金属",
        productId: "P001",
        productName: "iPhone 15 Pro",
        status: 1,
        price: 11999,
        stock: 50,
        sort: 2,
        remark: "大存储版本",
        specValues: { 颜色: "原色钛金属", 容量: "512G" }
      },
      {
        id: "3",
        skuCode: "SKU003",
        skuName: "iPhone 15 Pro 256G 蓝色钛金属",
        productId: "P001",
        productName: "iPhone 15 Pro",
        status: 0,
        price: 9999,
        stock: 0,
        sort: 3,
        remark: "缺货",
        specValues: { 颜色: "蓝色钛金属", 容量: "256G" }
      }
    ],
    pageNum: params.pageNum,
    pageSize: params.pageSize,
    total: 3
  };

  // 模拟搜索功能
  if (params.keyword) {
    mockData.list = mockData.list.filter(
      item => item.skuName.includes(params.keyword!) || item.productName.includes(params.keyword!)
    );
    mockData.total = mockData.list.length;
  }

  if (params.status !== undefined) {
    mockData.list = mockData.list.filter(item => item.status === params.status);
    mockData.total = mockData.list.length;
  }

  // 模拟根据SKU编码筛选
  if (params.skuCode) {
    mockData.list = mockData.list.filter(item => item.skuCode.includes(params.skuCode!));
    mockData.total = mockData.list.length;
  }
  return Promise.resolve({ code: "0", msg: "success", data: mockData });
  // 实际接口调用
  // return http.get<ResPage<SkuBase>>(PORT1 + '/sku/list', params);
};

// 获取SKU详情
export const getSkuDetail = (id: string) => {
  // 模拟数据
  const mockData: SkuFull = {
    id: id,
    skuCode: "SKU001",
    skuName: "iPhone 15 Pro",
    productId: "P001",
    productName: "iPhone 15 Pro",
    status: 1,
    price: 9999,
    stock: 100,
    sort: 1,
    remark: "热销款",
    specGroups: [
      {
        id: "1",
        name: "颜色",
        values: [
          { id: "1-1", name: "原色钛金属" },
          { id: "1-2", name: "蓝色钛金属" },
          { id: "1-3", name: "白色钛金属" },
          { id: "1-4", name: "黑色钛金属" }
        ]
      },
      {
        id: "2",
        name: "容量",
        values: [
          { id: "2-1", name: "256G" },
          { id: "2-2", name: "512G" },
          { id: "2-3", name: "1TB" }
        ]
      }
    ],
    skuCombinations: [
      {
        id: "1",
        skuCode: "SKU001",
        skuName: "iPhone 15 Pro 256G 原色钛金属",
        productId: "P001",
        productName: "iPhone 15 Pro",
        status: 1,
        price: 9999,
        stock: 100,
        sort: 1,
        remark: "热销款",
        specValues: { 颜色: "原色钛金属", 容量: "256G" }
      },
      {
        id: "2",
        skuCode: "SKU002",
        skuName: "iPhone 15 Pro 512G 原色钛金属",
        productId: "P001",
        productName: "iPhone 15 Pro",
        status: 1,
        price: 11999,
        stock: 50,
        sort: 2,
        remark: "大存储版本",
        specValues: { 颜色: "原色钛金属", 容量: "512G" }
      }
    ]
  };

  return Promise.resolve({ code: "0", msg: "success", data: mockData });
  // 实际接口调用
  // return http.get<ResultData<SkuFull>>(PORT1 + `/sku/${id}`);
};

// 保存SKU（新增/编辑）
export const saveSku = () => {
  return Promise.resolve({ code: "0", msg: "保存成功" });
  // 实际接口调用
  // return http.post(PORT1 + '/sku/save', params);
};

// 删除SKU
export const deleteSku = () => {
  // 模拟校验是否可删除
  const canDelete = Math.random() > 0.3; // 模拟70%概率可以删除
  if (!canDelete) {
    return Promise.resolve({ code: "1", msg: "该SKU存在关联订单，禁止删除" });
  }
  return Promise.resolve({ code: "0", msg: "删除成功" });
  // 实际接口调用
  // return http.delete(PORT1 + `/sku/${params.id}`);
};

// 切换SKU状态
export const changeSkuStatus = () => {
  return Promise.resolve({ code: "0", msg: "状态切换成功" });
  // 实际接口调用
  // return http.post(PORT1 + `/sku/${params.id}/status`, params);
};

// 批量设置价格
export const batchSetPrice = () => {
  return Promise.resolve({ code: "0", msg: "价格设置成功" });
  // 实际接口调用
  // return http.post(PORT1 + '/sku/batch/price', params);
};

// 批量设置库存
export const batchSetStock = () => {
  return Promise.resolve({ code: "0", msg: "库存设置成功" });
  // 实际接口调用
  // return http.post(PORT1 + '/sku/batch/stock', params);
};
