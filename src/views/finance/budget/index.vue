<template>
  <div class="budget-page">
    <div class="page-header">
      <h2>预算管理</h2>
      <p>制定和监控预算执行情况</p>
      <el-button type="primary" @click="handleAddBudget">添加预算</el-button>
    </div>

    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="预算类型">
          <el-select v-model="searchForm.type" placeholder="请选择预算类型" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="收入预算" value="收入" />
            <el-option label="支出预算" value="支出" />
          </el-select>
        </el-form-item>

        <el-form-item label="预算状态">
          <el-select v-model="searchForm.status" placeholder="请选择预算状态" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已超支" value="已超支" />
          </el-select>
        </el-form-item>

        <el-form-item label="预算周期">
          <el-select v-model="searchForm.period" placeholder="请选择预算周期" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="月度" value="月度" />
            <el-option label="季度" value="季度" />
            <el-option label="年度" value="年度" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入预算名称或描述"
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
        :data="budgetList"
        border
        stripe
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="预算ID" width="120" />
        <el-table-column prop="name" label="预算名称" />
        <el-table-column prop="type" label="预算类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '收入' ? 'success' : 'danger'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="预算周期" width="100" />
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column prop="month" label="月份" width="80" v-if="searchForm.period === '月度'" />
        <el-table-column prop="quarter" label="季度" width="80" v-if="searchForm.period === '季度'" />
        <el-table-column prop="budgetAmount" label="预算金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.budgetAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="实际金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.actualAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="remainingAmount" label="剩余金额" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.remainingAmount >= 0 ? 'text-success' : 'text-danger'">
              ¥{{ row.remainingAmount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="usageRate" label="使用率" width="100" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.usageRate"
              :stroke-color="row.usageRate > 90 ? '#f56c6c' : row.usageRate > 70 ? '#e6a23c' : '#67c23a'"
              :show-text="false"
              style="width: 80px"
            />
            <span style="margin-left: 5px">{{ row.usageRate.toFixed(1) }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="预算状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '执行中' ? 'primary' :
                row.status === '已完成' ? 'success' : 'danger'
              "
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)" style="margin-left: 5px">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" style="margin-left: 5px">
              删除
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
import { ElMessage, ElMessageBox } from 'element-plus';

// 搜索表单
const searchForm = ref({
  type: '',
  status: '',
  period: '',
  keyword: ''
});

// 加载状态
const loading = ref(false);

// 预算列表数据
const budgetList = ref([]);

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 模拟预算数据
const mockBudgets = Array.from({ length: 30 }, (_, index) => {
  const budgetAmount = Math.floor(Math.random() * 100000) + 50000;
  const actualAmount = Math.floor(Math.random() * budgetAmount * 1.2);
  const remainingAmount = budgetAmount - actualAmount;
  const usageRate = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
  
  return {
    id: `BUD${20000 + index}`,
    name: index % 2 === 0 ? `产品销售${index % 3 === 0 ? '季度' : '年度'}预算` : `办公${index % 4 === 0 ? '用品' : '设备'}${index % 3 === 0 ? '季度' : '年度'}预算`,
    type: index % 2 === 0 ? '收入' : '支出',
    period: index % 3 === 0 ? '季度' : index % 4 === 0 ? '月度' : '年度',
    year: new Date().getFullYear(),
    month: index % 4 === 0 ? Math.floor(Math.random() * 12) + 1 : null,
    quarter: index % 3 === 0 ? Math.floor(Math.random() * 4) + 1 : null,
    budgetAmount,
    actualAmount,
    remainingAmount,
    usageRate,
    status: usageRate > 100 ? '已超支' : usageRate > 90 ? '执行中' : '已完成',
    createTime: new Date(Date.now() - index * 86400000).toISOString().slice(0, 19).replace('T', ' ')
  };
});

// 加载预算数据
const loadBudgets = () => {
  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    budgetList.value = mockBudgets.slice(start, end);
    pagination.value.total = mockBudgets.length;
    loading.value = false;
  }, 500);
};

// 查询
const handleSearch = () => {
  pagination.value.currentPage = 1;
  loadBudgets();
  ElMessage.success('查询成功');
};

// 重置
const handleReset = () => {
  searchForm.value = {
    type: '',
    status: '',
    period: '',
    keyword: ''
  };
  pagination.value.currentPage = 1;
  loadBudgets();
  ElMessage.success('重置成功');
};

// 添加预算
const handleAddBudget = () => {
  ElMessage.info('添加预算');
};

// 查看预算详情
const handleView = (row: any) => {
  ElMessage.info(`查看预算详情：${row.id}`);
};

// 编辑预算
const handleEdit = (row: any) => {
  ElMessage.info(`编辑预算：${row.id}`);
};

// 删除预算
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除预算 ${row.id} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功');
    loadBudgets();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val;
  loadBudgets();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val;
  loadBudgets();
};

// 页面挂载时加载数据
onMounted(() => {
  loadBudgets();
});
</script>

<style scoped>
.budget-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h2 {
    margin-bottom: 5px;
  }

  .page-header p {
    margin-bottom: 10px;
  }

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