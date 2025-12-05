<template>
  <div class="finance-transactions">
    <div class="page-title">交易记录</div>
    <div class="search-form">
      <el-form :model="searchForm" inline @submit.prevent="search">
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.type" placeholder="请选择交易类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="收入" value="income"></el-option>
            <el-option label="支出" value="expense"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交易金额">
          <el-input-number v-model="searchForm.minAmount" placeholder="最小金额" :min="0" style="width: 120px;"></el-input-number>
          <span style="margin: 0 10px;">-</span>
          <el-input-number v-model="searchForm.maxAmount" placeholder="最大金额" :min="0" style="width: 120px;"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="transactions" border style="width: 100%">
        <el-table-column prop="id" label="交易ID" width="120"></el-table-column>
        <el-table-column prop="type" label="交易类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'income' ? 'success' : 'danger'">
              {{ scope.row.type === 'income' ? '收入' : '支出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额" width="120">
          <template #default="scope">
            <span :class="scope.row.type === 'income' ? 'income-amount' : 'expense-amount'">
              {{ scope.row.type === 'income' ? '+' : '-' }}¥{{ scope.row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="交易描述"></el-table-column>
        <el-table-column prop="category" label="交易分类" width="120"></el-table-column>
        <el-table-column prop="date" label="交易日期" width="150"></el-table-column>
        <el-table-column prop="status" label="交易状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'warning'">
              {{ scope.row.status === 'success' ? '成功' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, jumper, ->, total"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'success' | 'pending';
}

const searchForm = reactive({
  type: '',
  dateRange: null as [Date, Date] | null,
  minAmount: null as number | null,
  maxAmount: null as number | null
});

const transactions = ref<Transaction[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

onMounted(() => {
  loadTransactions();
});

const loadTransactions = () => {
  // 模拟数据
  const mockData: Transaction[] = [
    {
      id: 'TXN001',
      type: 'income',
      amount: 15000.00,
      description: '客户A项目回款',
      category: '项目收入',
      date: '2023-06-15 14:30:00',
      status: 'success'
    },
    {
      id: 'TXN002',
      type: 'expense',
      amount: 8500.00,
      description: '服务器托管费用',
      category: '运营成本',
      date: '2023-06-14 09:15:00',
      status: 'success'
    },
    {
      id: 'TXN003',
      type: 'income',
      amount: 22000.50,
      description: '客户B产品销售',
      category: '产品收入',
      date: '2023-06-13 16:45:00',
      status: 'success'
    },
    {
      id: 'TXN004',
      type: 'expense',
      amount: 3200.00,
      description: '员工工资发放',
      category: '人员工资',
      date: '2023-06-12 11:20:00',
      status: 'success'
    },
    {
      id: 'TXN005',
      type: 'income',
      amount: 8500.00,
      description: '客户C服务费用',
      category: '服务收入',
      date: '2023-06-11 10:00:00',
      status: 'success'
    },
    {
      id: 'TXN006',
      type: 'expense',
      amount: 1200.00,
      description: '办公用品采购',
      category: '办公费用',
      date: '2023-06-10 15:30:00',
      status: 'success'
    },
    {
      id: 'TXN007',
      type: 'income',
      amount: 18000.00,
      description: '客户D项目预付款',
      category: '项目收入',
      date: '2023-06-09 13:45:00',
      status: 'success'
    },
    {
      id: 'TXN008',
      type: 'expense',
      amount: 5600.00,
      description: '营销推广费用',
      category: '营销费用',
      date: '2023-06-08 14:20:00',
      status: 'success'
    },
    {
      id: 'TXN009',
      type: 'income',
      amount: 12500.75,
      description: '客户E产品销售',
      category: '产品收入',
      date: '2023-06-07 16:10:00',
      status: 'success'
    },
    {
      id: 'TXN010',
      type: 'expense',
      amount: 2800.00,
      description: '差旅费报销',
      category: '差旅费用',
      date: '2023-06-06 12:00:00',
      status: 'success'
    }
  ];
  transactions.value = mockData;
  total.value = 100;
};

const search = () => {
  ElMessage.success('搜索功能待实现');
};

const reset = () => {
  searchForm.type = '';
  searchForm.dateRange = null;
  searchForm.minAmount = null;
  searchForm.maxAmount = null;
};

const viewDetail = (transaction: Transaction) => {
  ElMessage.info(`查看交易详情：${transaction.id}`);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadTransactions();
};
</script>

<style scoped>
.finance-transactions {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.search-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.income-amount {
  color: #4CAF50;
  font-weight: 600;
}

.expense-amount {
  color: #FF6B6B;
  font-weight: 600;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>