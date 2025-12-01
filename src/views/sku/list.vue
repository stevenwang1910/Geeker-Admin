<template>
  <div class="sku-list-container">
    <!-- 搜索区域 -->
    <div class="search-form-wrapper">
      <el-form :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="searchForm.sku_code" placeholder="请输入SKU编码" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增SKU
      </el-button>
    </div>

    <!-- 列表区域 -->
    <div class="table-wrapper">
      <el-table v-loading="loading" :data="skuList" border stripe>
        <el-table-column prop="sku_code" label="SKU编码" width="150" />
        <el-table-column prop="sku_name" label="SKU名称" width="200" />
        <el-table-column prop="product_name" label="所属商品" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleSwitchStatus(row.id, row.status)"
            >
              <el-icon>{{ row.status === 1 ? "Minus" : "Check" }}</el-icon>
              {{ row.status === 1 ? "停用" : "启用" }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { getSkuList, deleteSku, switchSkuStatus } from "@/api/modules/sku";

const router = useRouter();

// 搜索表单
const searchForm = ref({
  keyword: "",
  sku_code: "",
  status: ""
});

// 加载状态
const loading = ref(false);

// SKU列表
const skuList = ref([]);

// 分页信息
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
});

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  fetchSkuList();
};

// 重置
const handleReset = () => {
  searchForm.value = {
    keyword: "",
    sku_code: "",
    status: ""
  };
  pagination.value.page = 1;
  fetchSkuList();
};

// 新增
const handleAdd = () => {
  router.push("/sku/edit/new");
};

// 编辑
const handleEdit = (id: string | number) => {
  router.push(`/sku/edit/${id}`);
};

// 切换状态
const handleSwitchStatus = async (id: string | number, status: number) => {
  try {
    await switchSkuStatus(id, status === 1 ? 0 : 1);
    ElMessage.success(`SKU已${status === 1 ? "停用" : "启用"}`);
    fetchSkuList();
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 删除
const handleDelete = async (id: string | number) => {
  try {
    await ElMessageBox.confirm("确定要删除该SKU吗？删除后将无法恢复。", "删除确认", {
      type: "warning"
    });
    await deleteSku(id);
    ElMessage.success("删除成功");
    fetchSkuList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.size = size;
  fetchSkuList();
};

// 分页页码变化
const handleCurrentChange = (page: number) => {
  pagination.value.page = page;
  fetchSkuList();
};

// 获取SKU列表
const fetchSkuList = async () => {
  loading.value = true;
  try {
    const response = await getSkuList({
      keyword: searchForm.value.keyword,
      status: searchForm.value.status ? Number(searchForm.value.status) : undefined,
      page: pagination.value.page,
      size: pagination.value.size
    });
    if (response.code === 200) {
      skuList.value = response.data.list;
      pagination.value.total = response.data.total;
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    ElMessage.error("获取SKU列表失败");
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchSkuList();
});
</script>

<style scoped>
.sku-list-container {
  padding: 20px;
}

.search-form-wrapper {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-bar {
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
