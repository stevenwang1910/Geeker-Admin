<template>
  <div class="logistics-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>物流信息管理</h2>
      <p>管理和查看所有物流信息</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入运单号或订单号搜索"
          prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 筛选器 -->
      <div class="filter-box">
        <SelectFilter :data="filterData" :default-values="filterResult" @change="handleFilterChange" />
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="operation-buttons">
      <el-button type="primary" icon="Plus">添加物流信息</el-button>
      <el-button type="success" icon="Edit">批量编辑</el-button>
      <el-button type="warning" icon="Delete">批量删除</el-button>
      <el-button type="info" icon="Download">导出数据</el-button>
    </div>

    <!-- 物流信息表格 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="logisticsNo" label="运单号" min-width="180" show-overflow-tooltip />
        <el-table-column prop="orderNo" label="订单号" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sender" label="寄件人" min-width="120" show-overflow-tooltip />
        <el-table-column prop="receiver" label="收件人" min-width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="物流状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="View" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="success" size="small" icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-section">
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

    <!-- 查看物流详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="物流详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="selectedLogistics" class="logistics-detail">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="运单号">{{ selectedLogistics.logisticsNo }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ selectedLogistics.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="寄件人">{{ selectedLogistics.sender }}</el-descriptions-item>
          <el-descriptions-item label="收件人">{{ selectedLogistics.receiver }}</el-descriptions-item>
          <el-descriptions-item label="物流状态" :span="2">
            <el-tag :type="getStatusType(selectedLogistics.status)">{{ getStatusText(selectedLogistics.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedLogistics.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ selectedLogistics.updateTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="logistics-timeline">
          <h3>物流轨迹</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in selectedLogistics.timeline"
              :key="index"
              :timestamp="item.time"
              :color="index === 0 ? 'green' : 'blue'"
            >
              {{ item.description }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="LogisticsManagement">
import { ref, onMounted, computed } from "vue";
import SelectFilter from "@/components/SelectFilter/index.vue";

// 搜索表单
const searchForm = ref({
  keyword: ""
});

// 筛选数据
const filterData = [
  {
    title: "物流状态",
    key: "status",
    options: [
      { label: "全部", value: "" },
      { label: "已下单", value: "1", icon: "ShoppingCart" },
      { label: "已发货", value: "2", icon: "Van" },
      { label: "已签收", value: "3", icon: "Edit" },
      { label: "已退回", value: "4", icon: "Guide" },
      { label: "已完成", value: "5", icon: "CircleCheck" }
    ]
  }
];

// 筛选结果
const filterResult = ref({ status: "" });

// 加载状态
const loading = ref(false);

// 表格数据
const tableData = ref<any[]>([]);

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 选中的物流信息（用于查看详情）
const selectedLogistics = ref<any>(null);

// 查看详情对话框可见性
const viewDialogVisible = ref(false);

// 选中的行
const selectedRows = ref<any[]>([]);

// 模拟物流数据
const mockLogisticsData = () => {
  const data = [];
  const statuses = ["1", "2", "3", "4", "5"];
  const senders = ["张三", "李四", "王五", "赵六", "孙七"];
  const receivers = ["客户A", "客户B", "客户C", "客户D", "客户E"];

  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    data.push({
      id: i,
      logisticsNo: `LOG${String(i).padStart(8, '0')}`,
      orderNo: `ORD${String(i).padStart(8, '0')}`,
      sender: senders[Math.floor(Math.random() * senders.length)],
      receiver: receivers[Math.floor(Math.random() * receivers.length)],
      status: status,
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      timeline: generateTimeline(status)
    });
  }
  return data;
};

// 生成物流轨迹
const generateTimeline = (status: string) => {
  const timeline = [
    { time: "2023-10-01 10:00:00", description: "订单已创建" },
    { time: "2023-10-01 14:30:00", description: "包裹已揽收" }
  ];

  if (status >= "2") {
    timeline.push({ time: "2023-10-02 09:15:00", description: "包裹已发出" });
    timeline.push({ time: "2023-10-03 16:45:00", description: "包裹正在运输途中" });
  }

  if (status >= "3") {
    timeline.push({ time: "2023-10-04 11:20:00", description: "包裹已到达目的地" });
    timeline.push({ time: "2023-10-04 15:30:00", description: "快递员正在派送" });
  }

  if (status === "3") {
    timeline.push({ time: "2023-10-04 17:45:00", description: "包裹已签收" });
  } else if (status === "4") {
    timeline.push({ time: "2023-10-04 17:45:00", description: "包裹已退回" });
  } else if (status === "5") {
    timeline.push({ time: "2023-10-04 17:45:00", description: "包裹已签收，交易完成" });
  }

  return timeline.reverse();
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    "1": "已下单",
    "2": "已发货",
    "3": "已签收",
    "4": "已退回",
    "5": "已完成"
  };
  return statusMap[status] || "未知状态";
};

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: { [key: string]: string } = {
    "1": "info",
    "2": "primary",
    "3": "success",
    "4": "warning",
    "5": "success"
  };
  return typeMap[status] || "default";
};

// 过滤后的数据
const filteredData = computed(() => {
  let data = mockLogisticsData();

  // 关键词搜索
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase();
    data = data.filter(item => 
      item.logisticsNo.toLowerCase().includes(keyword) || 
      item.orderNo.toLowerCase().includes(keyword)
    );
  }

  // 状态筛选
  if (filterResult.value.status) {
    data = data.filter(item => item.status === filterResult.value.status);
  }

  return data;
});

// 分页后的数据
const paginatedData = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredData.value.slice(start, end);
});

// 加载表格数据
const loadTableData = () => {
  loading.value = true;
  
  // 模拟异步请求
  setTimeout(() => {
    tableData.value = paginatedData.value;
    pagination.value.total = filteredData.value.length;
    loading.value = false;
  }, 500);
};

// 处理搜索
const handleSearch = () => {
  pagination.value.currentPage = 1;
  loadTableData();
};

// 处理筛选变化
const handleFilterChange = (val: any) => {
  filterResult.value = val;
  pagination.value.currentPage = 1;
  loadTableData();
};

// 处理页面大小变化
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val;
  pagination.value.currentPage = 1;
  loadTableData();
};

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val;
  loadTableData();
};

// 处理行选择
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
};

// 处理查看详情
const handleView = (row: any) => {
  selectedLogistics.value = row;
  viewDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: any) => {
  console.log("编辑物流信息:", row);
  // TODO: 实现编辑功能
};

// 处理删除
const handleDelete = (row: any) => {
  console.log("删除物流信息:", row);
  // TODO: 实现删除功能
};

// 页面挂载时加载数据
onMounted(() => {
  loadTableData();
});
</script>

<style scoped lang="scss">
.logistics-management {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;
    
    h2 {
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    p {
      margin: 0;
      color: var(--el-text-color-secondary);
    }
  }

  .search-filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    
    .search-box {
      flex: 1;
      min-width: 300px;
    }
    
    .filter-box {
      flex: 1;
      min-width: 200px;
    }
  }

  .operation-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .table-section {
    margin-bottom: 20px;
    
    .el-table {
      width: 100%;
    }
  }

  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .logistics-detail {
    .logistics-timeline {
      margin-top: 20px;
      
      h3 {
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>