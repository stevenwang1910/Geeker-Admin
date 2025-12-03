<template>
  <div class="logistics-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>物流信息管理</h2>
      <el-button type="primary" icon="Plus" @click="handleAdd">添加物流信息</el-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <SelectFilter :data="filterData" :default-values="filterResult" @change="handleFilterChange" />
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchParam.keyword"
        placeholder="请输入物流单号、收件人姓名或手机号搜索"
        clearable
        prefix-icon="Search"
        style="width: 400px"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <el-button @click="handleReset" style="margin-left: 10px">重置</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <!-- 批量操作区域 -->
      <div style="display: flex; align-items: center; margin-bottom: 10px">
        <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        <el-button type="danger" style="margin-left: 10px" @click="handleBatchDelete" :disabled="selectedRows.length === 0"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="logisticsNo" label="物流单号" min-width="150" />
        <el-table-column prop="recipientName" label="收件人姓名" min-width="120" />
        <el-table-column prop="recipientPhone" label="收件人手机号" min-width="150" />
        <el-table-column prop="recipientAddress" label="收件地址" min-width="200" />
        <el-table-column prop="logisticsCompany" label="物流公司" min-width="120" />
        <el-table-column prop="logisticsStatus" label="物流状态" min-width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.logisticsStatus)">
              {{ getStatusLabel(scope.row.logisticsStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="updateTime" label="更新时间" min-width="180" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleDialogClose">
      <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="formData.logisticsNo" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="收件人姓名" prop="recipientName">
          <el-input v-model="formData.recipientName" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="收件人手机号" prop="recipientPhone">
          <el-input v-model="formData.recipientPhone" placeholder="请输入收件人手机号" />
        </el-form-item>
        <el-form-item label="收件地址" prop="recipientAddress">
          <el-input v-model="formData.recipientAddress" placeholder="请输入收件地址" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-select v-model="formData.logisticsCompany" placeholder="请选择物流公司">
            <el-option label="顺丰速运" value="顺丰速运" />
            <el-option label="中通快递" value="中通快递" />
            <el-option label="圆通快递" value="圆通快递" />
            <el-option label="申通快递" value="申通快递" />
            <el-option label="韵达快递" value="韵达快递" />
            <el-option label="京东物流" value="京东物流" />
            <el-option label="EMS" value="EMS" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流状态" prop="logisticsStatus">
          <el-select v-model="formData.logisticsStatus" placeholder="请选择物流状态">
            <el-option label="已下单" value="1" />
            <el-option label="已发货" value="2" />
            <el-option label="已签收" value="3" />
            <el-option label="已退回" value="4" />
            <el-option label="已完成" value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="LogisticsManagement">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import SelectFilter from "@/components/SelectFilter/index.vue";

// 模拟物流状态选项
const logisticsStatusOptions = [
  { label: "全部", value: "" },
  { label: "已下单", value: "1", icon: "ShoppingCart" },
  { label: "已发货", value: "2", icon: "Van" },
  { label: "已签收", value: "3", icon: "Edit" },
  { label: "已退回", value: "4", icon: "Guide" },
  { label: "已完成", value: "5", icon: "CircleCheck" }
];

// 筛选数据
const filterData = [
  {
    title: "物流状态",
    key: "logisticsStatus",
    options: logisticsStatusOptions
  }
];

// 筛选结果
const filterResult = ref({ logisticsStatus: "" });

// 搜索参数
const searchParam = ref({ keyword: "" });

// 表格数据
const tableData = ref<any[]>([]);

// 加载状态
const loading = ref(false);

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 对话框可见性
const dialogVisible = ref(false);

// 对话框标题
const dialogTitle = ref("");

// 表单引用
const formRef = ref<any>(null);

// 批量操作相关
const selectAll = ref(false);
const selectedRows = ref<any[]>([]);

// 处理选择变化
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
  selectAll.value = val.length === tableData.value.length;
};

// 处理全选
const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedRows.value = [...tableData.value];
  } else {
    selectedRows.value = [];
  }
};

// 处理批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条物流信息吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    // 模拟批量删除操作
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success("批量删除成功");
    selectedRows.value = [];
    selectAll.value = false;
    getLogisticsData();
  } catch (error) {
    ElMessage.error("批量删除失败");
    console.error(error);
  }
};

// 表单数据
const formData = reactive({
  id: null,
  logisticsNo: "",
  recipientName: "",
  recipientPhone: "",
  recipientAddress: "",
  logisticsCompany: "",
  logisticsStatus: ""
});

// 表单验证规则
const formRules = reactive({
  logisticsNo: [{ required: true, message: "请输入物流单号", trigger: "blur" }],
  recipientName: [{ required: true, message: "请输入收件人姓名", trigger: "blur" }],
  recipientPhone: [{ required: true, message: "请输入收件人手机号", trigger: "blur" }],
  recipientAddress: [{ required: true, message: "请输入收件地址", trigger: "blur" }],
  logisticsCompany: [{ required: true, message: "请选择物流公司", trigger: "change" }],
  logisticsStatus: [{ required: true, message: "请选择物流状态", trigger: "change" }]
});

// 模拟获取物流数据
const getLogisticsData = async () => {
  loading.value = true;
  try {
    // 模拟接口请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟数据
    const mockData = [];
    for (let i = 1; i <= 50; i++) {
      mockData.push({
        id: i,
        logisticsNo: `LOG${String(i).padStart(6, "0")}`,
        recipientName: `用户${i}`,
        recipientPhone: `138${String(i).padStart(8, "0")}`,
        recipientAddress: `北京市朝阳区某某街道${i}号`,
        logisticsCompany: ["顺丰速运", "中通快递", "圆通快递", "申通快递", "韵达快递", "京东物流", "EMS"][
          Math.floor(Math.random() * 7)
        ],
        logisticsStatus: String(Math.floor(Math.random() * 5) + 1),
        createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString(),
        updateTime: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toLocaleString()
      });
    }

    // 应用筛选条件
    let filteredData = [...mockData];
    if (filterResult.value.logisticsStatus) {
      filteredData = filteredData.filter(item => item.logisticsStatus === filterResult.value.logisticsStatus);
    }

    // 应用搜索条件
    if (searchParam.value.keyword) {
      const keyword = searchParam.value.keyword.toLowerCase();
      filteredData = filteredData.filter(
        item =>
          item.logisticsNo.toLowerCase().includes(keyword) ||
          item.recipientName.toLowerCase().includes(keyword) ||
          item.recipientPhone.includes(keyword)
      );
    }

    // 应用分页
    pagination.total = filteredData.length;
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    tableData.value = filteredData.slice(startIndex, endIndex);
  } catch (error) {
    ElMessage.error("获取物流数据失败");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 获取物流状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case "1":
      return "info";
    case "2":
      return "warning";
    case "3":
      return "success";
    case "4":
      return "danger";
    case "5":
      return "success";
    default:
      return "info";
  }
};

// 获取物流状态标签文本
const getStatusLabel = (status: string) => {
  const option = logisticsStatusOptions.find(item => item.value === status);
  return option ? option.label : status;
};

// 处理筛选变化
const handleFilterChange = (val: any) => {
  filterResult.value = val;
  pagination.currentPage = 1;
  getLogisticsData();
};

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  getLogisticsData();
};

// 处理重置
const handleReset = () => {
  searchParam.value.keyword = "";
  filterResult.value = { logisticsStatus: "" };
  pagination.currentPage = 1;
  getLogisticsData();
};

// 处理分页大小变化
const handlePageSizeChange = (val: number) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getLogisticsData();
};

// 处理分页变化
const handlePageChange = (val: number) => {
  pagination.currentPage = val;
  getLogisticsData();
};

// 处理添加
const handleAdd = () => {
  dialogTitle.value = "添加物流信息";
  formData.id = null;
  formData.logisticsNo = "";
  formData.recipientName = "";
  formData.recipientPhone = "";
  formData.recipientAddress = "";
  formData.logisticsCompany = "";
  formData.logisticsStatus = "";
  dialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: any) => {
  dialogTitle.value = "编辑物流信息";
  formData.id = row.id;
  formData.logisticsNo = row.logisticsNo;
  formData.recipientName = row.recipientName;
  formData.recipientPhone = row.recipientPhone;
  formData.recipientAddress = row.recipientAddress;
  formData.logisticsCompany = row.logisticsCompany;
  formData.logisticsStatus = row.logisticsStatus;
  dialogVisible.value = true;
};

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除物流单号为"${row.logisticsNo}"的信息吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    // 模拟删除操作
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success(`物流单号为"${row.logisticsNo}"的信息已删除`);
    getLogisticsData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
      console.error(error);
    }
  }
};

// 处理对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields();
};

// 处理提交
const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    // 模拟提交操作
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success(formData.id ? "编辑成功" : "添加成功");
    dialogVisible.value = false;
    getLogisticsData();
  } catch (error) {
    ElMessage.error("提交失败，请检查表单信息");
    console.error(error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  getLogisticsData();
});
</script>

<style scoped lang="scss">
.logistics-management {
  padding: 20px;
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .filter-section {
    padding: 15px;
    margin-bottom: 20px;
    background: #f5f7fa;
    border-radius: 8px;
  }
  .search-section {
    margin-bottom: 20px;
  }
  .table-section {
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    .pagination-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
