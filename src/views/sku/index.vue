<template>
  <div class="sku-list-container">
    <el-card class="search-card">
      <el-form :model="searchForm" layout="inline" size="small">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="searchForm.skuCode" placeholder="请输入SKU编码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增SKU</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table v-loading="loading" :data="skuList" border style="width: 100%">
        <el-table-column prop="skuCode" label="SKU编码" min-width="150" />
        <el-table-column prop="skuName" label="SKU名称" min-width="200" />
        <el-table-column prop="productName" label="所属商品" min-width="150" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="1" inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" min-width="100">
          <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();

// 搜索表单
const searchForm = ref({
  keyword: "",
  skuCode: "",
  status: ""
});

// 加载状态
const loading = ref(false);

// SKU列表数据
interface SkuItem {
  id: number;
  skuCode: string;
  skuName: string;
  productName: string;
  status: string;
  price: number;
  stock: number;
  createTime: string;
}
const skuList = ref<SkuItem[]>([]);

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 查询SKU列表
const getSkuList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    const mockData = {
      code: 200,
      data: {
        list: [
          {
            id: 1,
            skuCode: "SKU001",
            skuName: "iPhone 15 Pro 128GB 深空黑色",
            productName: "iPhone 15 Pro",
            status: "1",
            price: 7999,
            stock: 100,
            createTime: "2025-12-01 10:00:00"
          },
          {
            id: 2,
            skuCode: "SKU002",
            skuName: "iPhone 15 Pro 256GB 深空黑色",
            productName: "iPhone 15 Pro",
            status: "1",
            price: 8999,
            stock: 50,
            createTime: "2025-12-01 10:05:00"
          },
          {
            id: 3,
            skuCode: "SKU003",
            skuName: "iPhone 15 Pro 128GB 白色",
            productName: "iPhone 15 Pro",
            status: "0",
            price: 7999,
            stock: 0,
            createTime: "2025-12-01 10:10:00"
          },
          {
            id: 4,
            skuCode: "SKU004",
            skuName: "iPhone 15 Pro Max 128GB 深空黑色",
            productName: "iPhone 15 Pro Max",
            status: "1",
            price: 8999,
            stock: 80,
            createTime: "2025-12-01 10:15:00"
          },
          {
            id: 5,
            skuCode: "SKU005",
            skuName: "iPhone 15 Pro Max 256GB 白色",
            productName: "iPhone 15 Pro Max",
            status: "1",
            price: 9999,
            stock: 60,
            createTime: "2025-12-01 10:20:00"
          }
        ],
        total: 5
      }
    };

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 应用搜索过滤
    let filteredList = [...mockData.data.list];
    if (searchForm.value.keyword) {
      const keyword = searchForm.value.keyword.toLowerCase();
      filteredList = filteredList.filter(item => 
        item.productName.toLowerCase().includes(keyword) || 
        item.skuName.toLowerCase().includes(keyword)
      );
    }
    if (searchForm.value.skuCode) {
      filteredList = filteredList.filter(item => 
        item.skuCode.includes(searchForm.value.skuCode)
      );
    }
    if (searchForm.value.status !== "") {
      filteredList = filteredList.filter(item => 
        item.status === searchForm.value.status
      );
    }

    // 应用分页
    const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const endIndex = startIndex + pagination.value.pageSize;
    skuList.value = filteredList.slice(startIndex, endIndex);
    pagination.value.total = filteredList.length;
  } catch (error) {
    ElMessage.error("获取SKU列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.value.currentPage = 1;
  getSkuList();
};

// 重置
const handleReset = () => {
  searchForm.value = {
    keyword: "",
    skuCode: "",
    status: ""
  };
  pagination.value.currentPage = 1;
  getSkuList();
};

// 新增SKU
const handleAdd = () => {
  router.push("/sku/edit/new");
};

// 编辑SKU
const handleEdit = (row: any) => {
  router.push(`/sku/edit/${row.id}`);
};

// 删除SKU
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm("确定要删除该SKU吗？删除后不可恢复", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success("删除成功");
    getSkuList();
  } catch (error) {
    // 用户取消删除
    console.log(row); // 避免ESLint误报
  }
};

// 切换状态
const handleStatusChange = async (row: any) => {
  // 保存当前状态，用于错误恢复
  const originalStatus = row.status;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success(`SKU已${row.status === "1" ? "启用" : "停用"}`);
  } catch (error) {
    // 恢复原来的状态
    row.status = originalStatus;
    ElMessage.error("状态切换失败");
  }
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  getSkuList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.value.currentPage = page;
  getSkuList();
};

// 页面挂载时获取SKU列表
onMounted(() => {
  getSkuList();
});
</script>

<style scoped>
.sku-list-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
