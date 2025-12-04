<template>
  <div class="batch-mall-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <span class="page-title">商品详情批量管理系统</span>
      <div class="header-buttons">
        <el-button type="primary" :icon="Upload" @click="showImportDialog"> 批量导入 </el-button>
        <el-button type="success" :icon="Download" @click="batchExport"> 批量导出 </el-button>
        <el-button type="info" :icon="Document" @click="showImportRecords"> 导入记录 </el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="content-box">
      <!-- 搜索和筛选栏 -->
      <div class="search-filter-bar">
        <el-input
          v-model="searchParams.keyword"
          placeholder="请输入商品名称或ID"
          style="width: 250px; margin-right: 10px"
          clearable
        >
          <template #prefix>
            <Search />
          </template>
        </el-input>
        <el-select
          v-model="searchParams.category"
          placeholder="请选择商品分类"
          style="width: 150px; margin-right: 10px"
          clearable
        >
          <el-option label="电子产品" value="electronics" />
          <el-option label="服装鞋帽" value="clothing" />
          <el-option label="家居用品" value="home" />
          <el-option label="食品饮料" value="food" />
        </el-select>
        <el-button type="primary" @click="searchProducts"> 搜索 </el-button>
        <el-button @click="resetSearch"> 重置 </el-button>
      </div>

      <!-- 商品表格 -->
      <el-table v-loading="tableLoading" :data="productList" style="width: 100%; margin-top: 20px" @row-click="showProductDetail">
        <el-table-column prop="id" label="商品ID" width="100" sortable />
        <el-table-column prop="name" label="商品名称" min-width="200" sortable />
        <el-table-column prop="category" label="商品分类" width="120" sortable />
        <el-table-column prop="price" label="价格" width="100" sortable>
          <template #default="scope"> ¥{{ scope.row.price }} </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" sortable />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === "active" ? "上架" : "下架" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editProduct(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="small" @click="deleteProduct(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 商品详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="商品详情" width="700px" draggable>
      <div v-if="selectedProduct" class="product-detail">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="product-images">
              <el-image :src="selectedProduct.image" fit="cover" />
            </div>
          </el-col>
          <el-col :span="14">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="商品ID">
                {{ selectedProduct.id }}
              </el-descriptions-item>
              <el-descriptions-item label="商品名称">
                {{ selectedProduct.name }}
              </el-descriptions-item>
              <el-descriptions-item label="商品分类">
                {{ selectedProduct.category }}
              </el-descriptions-item>
              <el-descriptions-item label="价格"> ¥{{ selectedProduct.price }} </el-descriptions-item>
              <el-descriptions-item label="库存">
                {{ selectedProduct.stock }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="selectedProduct.status === 'active' ? 'success' : 'danger'">
                  {{ selectedProduct.status === "active" ? "上架" : "下架" }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="描述">
                {{ selectedProduct.description }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          <span class="section-title">商品规格参数</span>
          <el-table :data="selectedProduct.specs" style="width: 100%; margin-top: 10px">
            <el-table-column prop="name" label="规格名称" width="150" />
            <el-table-column prop="value" label="规格值" />
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 批量导入组件 -->
    <ImportExcel ref="importRef" />

    <!-- 导入记录对话框 -->
    <el-dialog v-model="recordsDialogVisible" title="导入记录" width="800px" draggable>
      <el-table :data="importRecords" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column prop="fileName" label="文件名" min-width="200" />
        <el-table-column prop="importTime" label="导入时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === "success" ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="成功数量" width="100" />
        <el-table-column prop="errorCount" label="失败数量" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-if="scope.row.errorCount > 0" type="primary" size="small" @click="showErrorDetails(scope.row)">
              错误详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 错误详情对话框 -->
    <el-dialog v-model="errorDetailsDialogVisible" title="导入错误详情" width="700px" draggable>
      <el-table :data="currentErrorDetails" style="width: 100%">
        <el-table-column prop="rowIndex" label="行号" width="100" />
        <el-table-column prop="errorMessage" label="错误信息" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="batchMall">
import { ref, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { Upload, Download, Document, Search } from "@element-plus/icons-vue";
import ImportExcel from "@/components/ImportExcel/index.vue";

// 状态管理
const tableLoading = ref(false);
const productList = ref<any[]>([]);
const selectedProduct = ref<any>(null);
const detailDialogVisible = ref(false);
const recordsDialogVisible = ref(false);
const errorDetailsDialogVisible = ref(false);
const currentErrorDetails = ref<any[]>([]);

// 搜索参数
const searchParams = ref({
  keyword: "",
  category: ""
});

// 分页参数
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 导入组件引用
const importRef = ref();

// 导入记录
const importRecords = ref<any[]>([
  {
    id: 1,
    fileName: "商品数据.xlsx",
    importTime: "2025-12-01 10:30:25",
    status: "success",
    successCount: 50,
    errorCount: 0
  },
  {
    id: 2,
    fileName: "商品详情数据.xlsx",
    importTime: "2025-12-02 15:45:10",
    status: "success",
    successCount: 85,
    errorCount: 5
  },
  {
    id: 3,
    fileName: "商品批量数据.xlsx",
    importTime: "2025-12-03 09:15:30",
    status: "danger",
    successCount: 0,
    errorCount: 100
  }
]);

// 模拟商品数据
const mockProducts = () => {
  const products = [];
  const categories = ["electronics", "clothing", "home", "food"];
  const categoryNames = ["电子产品", "服装鞋帽", "家居用品", "食品饮料"];

  for (let i = 1; i <= 100; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    products.push({
      id: i,
      name: `商品${i}`,
      category: categoryNames[categoryIndex],
      price: (Math.random() * 1000).toFixed(2),
      stock: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.5 ? "active" : "inactive",
      description: `这是商品${i}的详细描述，包含商品的特点、用途等信息。`,
      image: `https://picsum.photos/seed/product${i}/400/300`,
      specs: [
        { name: "品牌", value: `品牌${Math.floor(Math.random() * 10) + 1}` },
        { name: "型号", value: `型号${i}` },
        { name: "规格", value: `${Math.floor(Math.random() * 100) + 10}cm` },
        { name: "颜色", value: ["红色", "蓝色", "绿色", "黑色", "白色"][Math.floor(Math.random() * 5)] }
      ]
    });
  }

  return products;
};

// 获取商品列表
const getProductList = () => {
  tableLoading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    let products = mockProducts();

    // 应用搜索条件
    if (searchParams.value.keyword) {
      products = products.filter(
        product => product.name.includes(searchParams.value.keyword) || product.id.toString().includes(searchParams.value.keyword)
      );
    }

    if (searchParams.value.category) {
      const categoryNames = {
        electronics: "电子产品",
        clothing: "服装鞋帽",
        home: "家居用品",
        food: "食品饮料"
      };
      products = products.filter(product => product.category === categoryNames[searchParams.value.category]);
    }

    // 分页
    const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const endIndex = startIndex + pagination.value.pageSize;

    productList.value = products.slice(startIndex, endIndex);
    pagination.value.total = products.length;

    tableLoading.value = false;
  }, 500);
};

// 搜索商品
const searchProducts = () => {
  pagination.value.currentPage = 1;
  getProductList();
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    keyword: "",
    category: ""
  };
  pagination.value.currentPage = 1;
  getProductList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  getProductList();
};

// 分页当前页变化
const handleCurrentChange = (page: number) => {
  pagination.value.currentPage = page;
  getProductList();
};

// 显示商品详情
const showProductDetail = (row: any) => {
  selectedProduct.value = row;
  detailDialogVisible.value = true;
};

// 编辑商品
const editProduct = (row: any) => {
  ElNotification({
    title: "温馨提示",
    message: `编辑商品 ${row.name}`,
    type: "info"
  });
};

// 删除商品
const deleteProduct = (id: number) => {
  ElNotification({
    title: "温馨提示",
    message: `删除商品 ID: ${id}`,
    type: "success"
  });

  // 重新获取商品列表
  getProductList();
};

// 显示导入对话框
const showImportDialog = () => {
  let params = {
    title: "商品数据",
    // tempApi: 下载模板的 API,
    // importApi: 上传数据的 API,
    getTableList: getProductList
  };
  importRef.value.acceptParams(params);
};

// 批量导出
const batchExport = () => {
  ElNotification({
    title: "温馨提示",
    message: "批量导出功能开发中...",
    type: "info"
  });
};

// 显示导入记录
const showImportRecords = () => {
  recordsDialogVisible.value = true;
};

// 显示错误详情
const showErrorDetails = (_: any) => {
  // 模拟错误详情数据
  currentErrorDetails.value = [
    { rowIndex: 5, errorMessage: "价格格式不正确" },
    { rowIndex: 10, errorMessage: "库存不能为空" },
    { rowIndex: 15, errorMessage: "商品分类不存在" },
    { rowIndex: 20, errorMessage: "商品名称已存在" },
    { rowIndex: 25, errorMessage: "图片链接无效" }
  ];

  errorDetailsDialogVisible.value = true;
};

// 页面加载时获取商品列表
onMounted(() => {
  getProductList();
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
