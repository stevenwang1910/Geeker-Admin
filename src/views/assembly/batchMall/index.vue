<template>
  <div class="batch-mall-container">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" :icon="Upload" @click="handleBatchImport">
        批量导入商品
      </el-button>
      <el-button type="success" :icon="Download" @click="handleBatchExport">
        批量导出商品
      </el-button>
      <el-button type="info" :icon="Document" @click="showImportRecords = true">
        导入记录
      </el-button>
    </div>

    <!-- 商品列表 -->
    <div class="card content-box">
      <div class="search-form">
        <el-form :model="searchForm" inline @submit.prevent="handleSearch">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="searchForm.category" placeholder="请选择商品分类" clearable>
              <el-option label="电子产品" value="electronics" />
              <el-option label="服装鞋帽" value="clothing" />
              <el-option label="食品饮料" value="food" />
              <el-option label="家居用品" value="home" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100" align="right">
          <template #default="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="right" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 商品详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="商品详情" width="800px" draggable>
      <div class="product-detail" v-if="currentProduct">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="product-images">
              <el-image
                :src="currentProduct.mainImage"
                fit="contain"
                style="width: 100%; height: 250px; margin-bottom: 10px"
              />
              <div class="thumbnails">
                <el-image
                  v-for="(img, index) in currentProduct.images"
                  :key="index"
                  :src="img"
                  fit="contain"
                  style="width: 60px; height: 60px; margin-right: 5px; cursor: pointer"
                  @click="currentProduct.mainImage = img"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="商品ID" :span="2">
                {{ currentProduct.id }}
              </el-descriptions-item>
              <el-descriptions-item label="商品名称" :span="2">
                {{ currentProduct.name }}
              </el-descriptions-item>
              <el-descriptions-item label="分类">
                {{ currentProduct.category }}
              </el-descriptions-item>
              <el-descriptions-item label="品牌">
                {{ currentProduct.brand }}
              </el-descriptions-item>
              <el-descriptions-item label="价格">
                ¥{{ currentProduct.price.toFixed(2) }}
              </el-descriptions-item>
              <el-descriptions-item label="库存">
                {{ currentProduct.stock }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="currentProduct.status === 'active' ? 'success' : 'info'">
                  {{ currentProduct.status === 'active' ? '上架' : '下架' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="销量">
                {{ currentProduct.sales }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间" :span="2">
                {{ currentProduct.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间" :span="2">
                {{ currentProduct.updateTime }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <div class="specifications" style="margin-top: 20px">
          <h4>规格参数</h4>
          <el-table :data="currentProduct.specifications" border style="width: 100%">
            <el-table-column prop="name" label="参数名称" width="150" />
            <el-table-column prop="value" label="参数值" />
          </el-table>
        </div>

        <div class="description" style="margin-top: 20px">
          <h4>商品描述</h4>
          <div style="padding: 10px; background: #f5f7fa; border-radius: 4px;">
            {{ currentProduct.description }}
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 导入记录弹窗 -->
    <el-dialog v-model="showImportRecords" title="导入记录" width="900px" draggable>
      <el-table
        :data="importRecords"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fileName" label="文件名" min-width="200" />
        <el-table-column prop="fileSize" label="文件大小" width="100" />
        <el-table-column prop="totalCount" label="总条数" width="100" />
        <el-table-column prop="successCount" label="成功条数" width="100" />
        <el-table-column prop="failCount" label="失败条数" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'error'">
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="importTime" label="导入时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="viewImportResult(scope.row)">
              查看结果
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 导入结果详情弹窗 -->
    <el-dialog v-model="importResultVisible" title="导入结果详情" width="900px" draggable>
      <div v-if="currentImportResult">
        <div class="result-summary" style="margin-bottom: 20px; padding: 10px; background: #f5f7fa; border-radius: 4px;">
          <p>文件：{{ currentImportResult.fileName }}</p>
          <p>总条数：{{ currentImportResult.totalCount }} | 成功：{{ currentImportResult.successCount }} | 失败：{{ currentImportResult.failCount }}</p>
          <p>状态：<el-tag :type="currentImportResult.status === 'success' ? 'success' : 'error'">{{ currentImportResult.status === 'success' ? '成功' : '失败' }}</el-tag></p>
        </div>

        <el-collapse v-model="activeResultTabs">
          <el-collapse-item title="成功数据" name="success">
            <el-table
              :data="currentImportResult.successData"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column prop="id" label="商品ID" width="80" />
              <el-table-column prop="name" label="商品名称" min-width="200" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="price" label="价格" width="100" align="right">
                <template #default="scope">
                  ¥{{ scope.row.price.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="stock" label="库存" width="100" align="right" />
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="失败数据" name="fail" v-if="currentImportResult.failData.length > 0">
            <el-table
              :data="currentImportResult.failData"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column prop="rowIndex" label="行号" width="80" />
              <el-table-column prop="name" label="商品名称" min-width="200" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="price" label="价格" width="100" align="right">
                <template #default="scope">
                  ¥{{ scope.row.price ? scope.row.price.toFixed(2) : '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="stock" label="库存" width="100" align="right" />
              <el-table-column prop="error" label="错误信息" min-width="200" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

    <!-- 批量导入组件 -->
    <ImportExcel ref="importRef" />
  </div>
</template>

<script setup lang="ts" name="batchMall">
import { ref, reactive, onMounted } from "vue";
import { Upload, Download, Document } from "@element-plus/icons-vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElNotification } from "element-plus";

// 搜索表单
const searchForm = reactive({
  name: "",
  category: "",
  status: ""
});

// 表格数据
const tableData = ref<any[]>([]);
const loading = ref(false);

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

// 弹窗状态
const detailDialogVisible = ref(false);
const showImportRecords = ref(false);
const importResultVisible = ref(false);

// 当前商品
const currentProduct = ref<any>(null);

// 导入记录
const importRecords = ref<any[]>([]);
const currentImportResult = ref<any>(null);
const activeResultTabs = ref<string[]>(["success"]);

// 导入组件引用
const importRef = ref();

// 模拟商品数据
const mockProducts = () => {
  const categories = ["电子产品", "服装鞋帽", "食品饮料", "家居用品"];
  const brands = ["Apple", "Nike", "可口可乐", "宜家"];
  const products: any[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const brandIndex = Math.floor(Math.random() * brands.length);
    const status = Math.random() > 0.3 ? "active" : "inactive";
    
    products.push({
      id: i,
      name: `商品${i} - ${categories[categoryIndex]}`,
      category: categories[categoryIndex],
      brand: brands[brandIndex],
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 5000),
      status: status,
      createTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      updateTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      mainImage: `https://picsum.photos/400/300?random=${i}`,
      images: [
        `https://picsum.photos/400/300?random=${i}`,
        `https://picsum.photos/400/300?random=${i + 100}`,
        `https://picsum.photos/400/300?random=${i + 200}`,
        `https://picsum.photos/400/300?random=${i + 300}`
      ],
      specifications: [
        { name: "规格", value: `规格${i}` },
        { name: "颜色", value: ["红色", "蓝色", "黑色", "白色"][Math.floor(Math.random() * 4)] },
        { name: "尺寸", value: ["S", "M", "L", "XL", "XXL"][Math.floor(Math.random() * 5)] },
        { name: "材质", value: ["纯棉", "涤纶", "皮革", "塑料", "金属"][Math.floor(Math.random() * 5)] }
      ],
      description: `这是商品${i}的详细描述信息，该商品属于${categories[categoryIndex]}类别，质量可靠，价格实惠，欢迎选购！`
    });
  }
  
  return products;
};

// 模拟导入记录
const mockImportRecords = () => {
  const records: any[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const status = Math.random() > 0.2 ? "success" : "fail";
    const totalCount = Math.floor(Math.random() * 1000) + 100;
    const successCount = status === "success" ? totalCount : Math.floor(totalCount * 0.8);
    const failCount = totalCount - successCount;
    
    records.push({
      id: i,
      fileName: `商品数据_${i}.xlsx`,
      fileSize: `${(Math.random() * 10 + 1).toFixed(2)}MB`,
      totalCount: totalCount,
      successCount: successCount,
      failCount: failCount,
      status: status,
      importTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      successData: [],
      failData: []
    });
  }
  
  return records;
};

// 获取商品列表
const getProductList = async () => {
  loading.value = true;
  
  // 模拟接口请求
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allProducts = mockProducts();
  const filtered = allProducts.filter(product => {
    const matchName = product.name.includes(searchForm.name);
    const matchCategory = searchForm.category ? product.category === searchForm.category : true;
    const matchStatus = searchForm.status ? product.status === searchForm.status : true;
    return matchName && matchCategory && matchStatus;
  });
  
  pagination.total = filtered.length;
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  
  tableData.value = filtered.slice(start, end);
  loading.value = false;
};

// 获取导入记录
const getImportRecords = async () => {
  // 模拟接口请求
  await new Promise(resolve => setTimeout(resolve, 300));
  
  importRecords.value = mockImportRecords();
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  getProductList();
};

// 重置
const handleReset = () => {
  searchForm.name = "";
  searchForm.category = "";
  searchForm.status = "";
  pagination.page = 1;
  getProductList();
};

// 排序
const handleSortChange = (sort: any) => {
  // 简单实现排序
  tableData.value.sort((a, b) => {
    if (sort.prop === 'price' || sort.prop === 'stock') {
      return sort.order === 'ascending' ? a[sort.prop] - b[sort.prop] : b[sort.prop] - a[sort.prop];
    } else {
      return sort.order === 'ascending' ? a[sort.prop].localeCompare(b[sort.prop]) : b[sort.prop].localeCompare(a[sort.prop]);
    }
  });
};

// 分页大小变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  getProductList();
};

// 当前页变化
const handleCurrentChange = (val: number) => {
  pagination.page = val;
  getProductList();
};

// 查看详情
const viewDetail = (product: any) => {
  currentProduct.value = { ...product };
  detailDialogVisible.value = true;
};

// 批量导入
const handleBatchImport = () => {
  const params = {
    title: "商品",
    fileSize: 10,
    fileType: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ],
    tempApi: () => {
      // 模拟下载模板
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: "template data" });
          ElMessage.success("商品模板下载成功");
        }, 300);
      });
    },
    importApi: async (formData: FormData) => {
      // 模拟导入接口
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据校验和导入结果
      const totalCount = Math.floor(Math.random() * 100) + 50;
      const successCount = Math.floor(totalCount * 0.95);
      const failCount = totalCount - successCount;
      
      // 模拟导入记录
      const newRecord = {
        id: importRecords.value.length + 1,
        fileName: formData.get("file")?.name || "未知文件",
        fileSize: `${(Math.random() * 5 + 1).toFixed(2)}MB`,
        totalCount: totalCount,
        successCount: successCount,
        failCount: failCount,
        status: failCount > 0 ? "fail" : "success",
        importTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        successData: [],
        failData: []
      };
      
      // 生成模拟成功数据
      for (let i = 0; i < successCount; i++) {
        newRecord.successData.push({
          id: tableData.value.length + i + 1,
          name: `导入商品${i + 1}`,
          category: ["电子产品", "服装鞋帽", "食品饮料", "家居用品"][Math.floor(Math.random() * 4)],
          price: Math.floor(Math.random() * 1000) + 100,
          stock: Math.floor(Math.random() * 1000)
        });
      }
      
      // 生成模拟失败数据
      for (let i = 0; i < failCount; i++) {
        newRecord.failData.push({
          rowIndex: i + 2, // 从第二行开始（第一行是表头）
          name: `失败商品${i + 1}`,
          category: ["电子产品", "服装鞋帽", "食品饮料", "家居用品"][Math.floor(Math.random() * 4)],
          price: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 100 : null,
          stock: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : null,
          error: ["价格不能为空", "库存不能为空", "分类格式错误", "商品名称过长"][Math.floor(Math.random() * 4)]
        });
      }
      
      importRecords.value.unshift(newRecord);
      
      if (failCount > 0) {
        ElNotification.warning({
          title: "导入完成",
          message: `导入完成！成功${successCount}条，失败${failCount}条，请查看导入记录`,
          duration: 5000
        });
      } else {
        ElNotification.success({
          title: "导入成功",
          message: `导入完成！成功${successCount}条`,
          duration: 3000
        });
      }
      
      // 刷新商品列表
      getProductList();
    },
    getTableList: getProductList
  };
  
  importRef.value.acceptParams(params);
};

// 批量导出
const handleBatchExport = () => {
  // 模拟导出
  ElMessage.info("正在导出商品数据...");
  setTimeout(() => {
    ElMessage.success("商品数据导出成功");
  }, 1000);
};

// 查看导入结果
const viewImportResult = (record: any) => {
  // 模拟获取导入结果详情
  currentImportResult.value = { ...record };
  
  // 如果没有数据，生成模拟数据
  if (currentImportResult.value.successData.length === 0) {
    // 生成模拟成功数据
    for (let i = 0; i < currentImportResult.value.successCount; i++) {
      currentImportResult.value.successData.push({
        id: 1000 + i,
        name: `导入商品${i + 1}`,
        category: ["电子产品", "服装鞋帽", "食品饮料", "家居用品"][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 1000) + 100,
        stock: Math.floor(Math.random() * 1000)
      });
    }
    
    // 生成模拟失败数据
    for (let i = 0; i < currentImportResult.value.failCount; i++) {
      currentImportResult.value.failData.push({
        rowIndex: i + 2, // 从第二行开始（第一行是表头）
        name: `失败商品${i + 1}`,
        category: ["电子产品", "服装鞋帽", "食品饮料", "家居用品"][Math.floor(Math.random() * 4)],
        price: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 100 : null,
        stock: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : null,
        error: ["价格不能为空", "库存不能为空", "分类格式错误", "商品名称过长"][Math.floor(Math.random() * 4)]
      });
    }
  }
  
  importResultVisible.value = true;
};

// 初始化数据
onMounted(() => {
  getProductList();
  getImportRecords();
});
</script>

<style scoped lang="scss">
.batch-mall-container {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}

.product-detail {
  padding: 10px;
}

.product-images {
  text-align: center;
}

.thumbnails {
  display: flex;
  justify-content: center;
}

.specifications h4,
.description h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.result-summary p {
  margin: 5px 0;
}
</style>