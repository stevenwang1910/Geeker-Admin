<template>
  <div class="transaction-page">
    <div class="page-header">
      <h2>交易记录</h2>
      <p>查询和管理所有财务交易记录</p>
    </div>

    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.type" placeholder="请选择交易类型" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="收入" value="收入" />
            <el-option label="支出" value="支出" />
          </el-select>
        </el-form-item>

        <el-form-item label="交易状态">
          <el-select v-model="searchForm.status" placeholder="请选择交易状态" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="已完成" value="已完成" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>

        <el-form-item label="交易日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
          />
        </el-form-item>

        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入交易描述或金额"
            style="width: 200px"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table
        :data="transactionList"
        border
        stripe
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="交易ID" width="120" />
        <el-table-column prop="date" label="交易日期" width="120" />
        <el-table-column prop="type" label="交易类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '收入' ? 'success' : 'danger'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="交易描述" />
        <el-table-column prop="amount" label="交易金额" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.type === '收入' ? 'text-success' : 'text-danger'">
              {{ row.type === '收入' ? '+' : '-' }}¥{{ row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="交易状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '已完成' ? 'success' :
                row.status === '处理中' ? 'warning' : 'danger'
              "
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)" style="margin-left: 5px">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 搜索表单
const searchForm = ref({
  type: '',
  status: '',
  dateRange: [] as Date[],
  keyword: ''
});

// 加载状态
const loading = ref(false);

// 交易列表数据
const transactionList = ref([]);

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 模拟交易数据
const mockTransactions = Array.from({ length: 50 }, (_, index) => ({
  id: `TX${10000 + index}`,
  date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
  type: index % 3 === 0 ? '支出' : '收入',
  description: index % 3 === 0 ? `办公用品采购 ${index + 1}` : `产品销售收入 ${index + 1}`,
  amount: Math.floor(Math.random() * 10000) + 100,
  status: index % 5 === 0 ? '处理中' : index % 7 === 0 ? '已取消' : '已完成',
  creator: `用户${Math.floor(Math.random() * 10) + 1}`,
  createTime: new Date(Date.now() - index * 86400000).toISOString().slice(0, 19).replace('T', ' ')
}));

// 加载交易数据
const loadTransactions = () => {
  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    transactionList.value = mockTransactions.slice(start, end);
    pagination.value.total = mockTransactions.length;
    loading.value = false;
  }, 500);
};

// 查询
const handleSearch = () => {
  pagination.value.currentPage = 1;
  loadTransactions();
  ElMessage.success('查询成功');
};

// 重置
const handleReset = () => {
  searchForm.value = {
    type: '',
    status: '',
    dateRange: [],
    keyword: ''
  };
  pagination.value.currentPage = 1;
  loadTransactions();
  ElMessage.success('重置成功');
};

// 查看交易详情
const handleView = (row: any) => {
  ElMessage.info(`查看交易详情：${row.id}`);
};

// 编辑交易
const handleEdit = (row: any) => {
  ElMessage.info(`编辑交易：${row.id}`);
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val;
  loadTransactions();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val;
  loadTransactions();
};

// 页面挂载时加载数据
onMounted(() => {
  loadTransactions();
});
</script>

<style scoped>
.transaction-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.text-success {
  color: #67c23a;
  font-weight: 600;
}

.text-danger {
  color: #f56c6c;
  font-weight: 600;
}

@media (max-width: 768px) {
  .search-form {
    padding: 15px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .table-container {
    padding: 15px;
    overflow-x: auto;
  }
}
</style>