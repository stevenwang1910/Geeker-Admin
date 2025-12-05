<template>
  <div class="finance-transaction-budget">
    <h1>交易与预算</h1>
    
    <!-- 交易记录 -->
    <h2>交易记录</h2>
    <div class="search-container">
      <el-input placeholder="搜索交易记录" v-model="searchText" style="width: 300px">
        <template #append>
          <el-button @click="searchTransactions">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
    <el-table :data="transactionsData" style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="交易ID" width="120" />
      <el-table-column prop="type" label="交易类型" width="120" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="date" label="交易日期" width="150" />
      <el-table-column prop="description" label="描述" />
    </el-table>
    
    <!-- 预算管理 -->
    <h2>预算管理</h2>
    <div class="budget-list">
      <div class="budget-item" v-for="budget in budgetsData" :key="budget.id">
        <div class="budget-info">
          <h3>{{ budget.category }}</h3>
          <p>预算金额: {{ budget.amount }}</p>
          <p>已使用: {{ budget.used }}</p>
          <p>剩余: {{ budget.remaining }}</p>
        </div>
        <div class="budget-progress">
          <el-progress :percentage="budget.percentage" :color="getProgressColor(budget.percentage)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";

// 交易记录数据
const searchText = ref("");
const transactionsData = ref([
  { id: "1", type: "收入", amount: "¥1000", date: "2023-01-01", description: "销售产品" },
  { id: "2", type: "支出", amount: "¥200", date: "2023-01-02", description: "购买办公用品" },
  { id: "3", type: "收入", amount: "¥1500", date: "2023-01-03", description: "提供服务" },
  { id: "4", type: "支出", amount: "¥500", date: "2023-01-04", description: "支付房租" },
  { id: "5", type: "收入", amount: "¥2000", date: "2023-01-05", description: "销售产品" }
]);

// 预算数据
const budgetsData = ref([
  { id: "1", category: "技术部", amount: "¥100,000", used: "¥50,000", remaining: "¥50,000", percentage: 50 },
  { id: "2", category: "市场部", amount: "¥50,000", used: "¥30,000", remaining: "¥20,000", percentage: 60 },
  { id: "3", category: "销售部", amount: "¥80,000", used: "¥40,000", remaining: "¥40,000", percentage: 50 },
  { id: "4", category: "财务部", amount: "¥20,000", used: "¥10,000", remaining: "¥10,000", percentage: 50 }
]);

// 搜索交易记录
const searchTransactions = () => {
  // 这里可以添加搜索交易记录的逻辑
  console.log("搜索交易记录:", searchText.value);
};

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 50) return "#1890ff";
  if (percentage < 80) return "#faad14";
  return "#f5222d";
};

onMounted(() => {
  // 这里可以添加获取交易记录和预算数据的逻辑
  console.log("获取交易记录和预算数据");
});
</script>

<style scoped>
.finance-transaction-budget {
  padding: 20px;
}

.search-container {
  margin-top: 20px;
}

.budget-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.budget-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.budget-progress {
  margin-top: 20px;
}
</style>