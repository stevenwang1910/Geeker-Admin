<template>
  <div class="finance-overview">
    <h1>财务概览</h1>
    
    <!-- 财务统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>总收入</h3>
        <p class="stat-value">¥{{ totalIncome.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>总支出</h3>
        <p class="stat-value">¥{{ totalExpense.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>净利润</h3>
        <p class="stat-value">¥{{ netProfit.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h3>总资产</h3>
        <p class="stat-value">¥{{ totalAssets.toLocaleString() }}</p>
      </div>
    </div>
    
    <!-- 统计分析图表 -->
    <h2>统计分析</h2>
    <div class="stats-container">
      <div class="chart-card">
        <h3>收入趋势</h3>
        <div class="chart-placeholder">
          <p>这里将显示收入趋势图表</p>
        </div>
      </div>
      <div class="chart-card">
        <h3>支出分类</h3>
        <div class="chart-placeholder">
          <p>这里将显示支出分类图表</p>
        </div>
      </div>
      <div class="chart-card">
        <h3>利润对比</h3>
        <div class="chart-placeholder">
          <p>这里将显示利润对比图表</p>
        </div>
      </div>
    </div>
    
    <!-- 财务报表 -->
    <h2>财务报表</h2>
    <div class="report-container">
      <div class="report-card">
        <h3>资产负债表</h3>
        <div class="report-placeholder">
          <p>这里将显示资产负债表</p>
        </div>
      </div>
      <div class="report-card">
        <h3>利润表</h3>
        <div class="report-placeholder">
          <p>这里将显示利润表</p>
        </div>
      </div>
      <div class="report-card">
        <h3>现金流量表</h3>
        <div class="report-placeholder">
          <p>这里将显示现金流量表</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 财务数据
const totalIncome = ref(1234567);
const totalExpense = ref(765432);
const netProfit = ref(469135);
const totalAssets = ref(5678901);

onMounted(() => {
  // 这里可以添加获取财务数据的逻辑
  console.log("获取财务数据");
});
</script>

<style scoped>
.finance-overview {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.stat-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  margin-top: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.report-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.report-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.report-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  margin-top: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>