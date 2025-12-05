<template>
  <div class="finance-dashboard">
    <div class="page-header">
      <h2>财务概览</h2>
      <p>实时查看财务数据和关键指标</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon income">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-content">
          <h3>总收入</h3>
          <p class="stat-value">¥128,560.00</p>
          <p class="stat-change positive">+12.5% 较上月</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon expense">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="stat-content">
          <h3>总支出</h3>
          <p class="stat-value">¥78,230.00</p>
          <p class="stat-change negative">+8.2% 较上月</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon profit">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>净利润</h3>
          <p class="stat-value">¥50,330.00</p>
          <p class="stat-change positive">+18.3% 较上月</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon balance">
          <el-icon><BankCard /></el-icon>
        </div>
        <div class="stat-content">
          <h3>账户余额</h3>
          <p class="stat-value">¥234,560.00</p>
          <p class="stat-change positive">+5.2% 较上月</p>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>收支趋势</h3>
        <div class="chart-container">
          <ECharts :option="trendChartOption" style="height: 300px" />
        </div>
      </div>

      <div class="chart-card">
        <h3>支出分类</h3>
        <div class="chart-container">
          <ECharts :option="categoryChartOption" style="height: 300px" />
        </div>
      </div>
    </div>

    <div class="recent-transactions">
      <h3>最近交易</h3>
      <el-table :data="recentTransactions" border stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '收入' ? 'success' : 'danger'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.type === '收入' ? 'text-success' : 'text-danger'">
              {{ row.type === '收入' ? '+' : '-' }}¥{{ row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === "已完成" ? "success" : "warning"">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ECharts from "@/components/ECharts/index.vue";
import { Wallet, ShoppingCart, Money, BankCard } from "@element-plus/icons-vue";

// 收支趋势图表配置
const trendChartOption = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" }
  },
  legend: {
    data: ["收入", "支出"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: '¥{value}' }
  },
  series: [
    {
      name: '收入',
      type: 'bar',
      data: [12000, 15000, 18000, 16000, 20000, 22000, 25000, 23000, 28000, 30000, 32000, 35000],
      itemStyle: { color: '#67c23a' }
    },
    {
      name: '支出',
      type: 'bar',
      data: [8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000],
      itemStyle: { color: '#f56c6c' }
    }
  ]
});

// 支出分类图表配置
const categoryChartOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '支出分类',
      type: 'pie',
      radius: '70%',
      data: [
        { value: 25000, name: '办公用品', itemStyle: { color: '#67c23a' } },
        { value: 18000, name: '员工薪资', itemStyle: { color: '#409eff' } },
        { value: 15000, name: '房租水电', itemStyle: { color: '#e6a23c' } },
        { value: 12000, name: '市场营销', itemStyle: { color: '#f56c6c' } },
        { value: 8230, name: '其他支出', itemStyle: { color: '#909399' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

// 最近交易数据
const recentTransactions = ref([
  { date: '2025-12-05', type: '收入', description: '产品销售收入', amount: 12500.00, status: '已完成' },
  { date: '2025-12-04', type: '支出', description: '办公用品采购', amount: 2300.50, status: '已完成' },
  { date: '2025-12-03', type: '收入', description: '服务费用收入', amount: 8900.00, status: '已完成' },
  { date: '2025-12-02', type: '支出', description: '员工薪资发放', amount: 56000.00, status: '已完成' },
  { date: '2025-12-01', type: '支出', description: '房租水电缴费', amount: 4500.00, status: '已完成' },
  { date: '2025-11-30', type: '收入', description: '产品销售收入', amount: 15600.00, status: '已完成' },
  { date: '2025-11-29', type: '支出', description: '市场营销费用', amount: 3200.00, status: '已完成' },
  { date: '2025-11-28', type: '收入', description: '服务费用收入', amount: 6700.00, status: '已完成' }
]);
</script>

<style scoped>
.finance-dashboard {
  padding: 20px;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0 0 5px;
  font-size: 24px;
  font-weight: 600;
}
.page-header p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 15px;
  font-size: 24px;
  border-radius: 50%;
}
.stat-icon.income {
  color: #67c23a;
  background: #f0f9eb;
}
.stat-icon.expense {
  color: #f56c6c;
  background: #fef0f0;
}
.stat-icon.profit {
  color: #409eff;
  background: #f0f9ff;
}
.stat-icon.balance {
  color: #e6a23c;
  background: #faf5e6;
}
.stat-content h3 {
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}
.stat-value {
  margin: 0 0 5px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
.stat-change {
  margin: 0;
  font-size: 12px;
}
.stat-change.positive {
  color: #67c23a;
}
.stat-change.negative {
  color: #f56c6c;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.chart-card {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.chart-card h3 {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: 600;
}
.chart-container {
  width: 100%;
}
.recent-transactions {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.recent-transactions h3 {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: 600;
}
.text-success {
  font-weight: 600;
  color: #67c23a;
}
.text-danger {
  font-weight: 600;
  color: #f56c6c;
}

@media (width <= 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>