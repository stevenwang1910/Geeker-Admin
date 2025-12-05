<template>
  <div class="statistics-page">
    <div class="page-header">
      <h2>统计分析</h2>
      <p>深入分析财务数据，提供决策支持</p>
    </div>

    <div class="date-selector">
      <el-form :model="dateForm" inline>
        <el-form-item label="统计周期">
          <el-select v-model="dateForm.period" placeholder="请选择统计周期" style="width: 150px" @change="loadStatistics">
            <el-option label="月度" value="monthly" />
            <el-option label="季度" value="quarterly" />
            <el-option label="年度" value="yearly" />
          </el-select>
        </el-form-item>

        <el-form-item label="年份">
          <el-select v-model="dateForm.year" placeholder="请选择年份" style="width: 120px" @change="loadStatistics">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year + '年'"
              :value="year"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="月份" v-if="dateForm.period === 'monthly'">
          <el-select v-model="dateForm.month" placeholder="请选择月份" style="width: 120px" @change="loadStatistics">
            <el-option
              v-for="month in 12"
              :key="month"
              :label="month + '月'"
              :value="month"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="季度" v-if="dateForm.period === 'quarterly'">
          <el-select v-model="dateForm.quarter" placeholder="请选择季度" style="width: 120px" @change="loadStatistics">
            <el-option label="第一季度" value="1" />
            <el-option label="第二季度" value="2" />
            <el-option label="第三季度" value="3" />
            <el-option label="第四季度" value="4" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon income">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-content">
          <h3>总收入</h3>
          <p class="stat-value">¥{{ statistics.totalIncome.toFixed(2) }}</p>
          <p class="stat-change positive">+{{ statistics.incomeGrowth }}% 较上期</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon expense">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="stat-content">
          <h3>总支出</h3>
          <p class="stat-value">¥{{ statistics.totalExpense.toFixed(2) }}</p>
          <p class="stat-change negative">+{{ statistics.expenseGrowth }}% 较上期</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon profit">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <h3>净利润</h3>
          <p class="stat-value">¥{{ statistics.netProfit.toFixed(2) }}</p>
          <p class="stat-change positive">+{{ statistics.profitGrowth }}% 较上期</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon ratio">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="stat-content">
          <h3>利润率</h3>
          <p class="stat-value">{{ statistics.profitMargin.toFixed(2) }}%</p>
          <p class="stat-change positive">+{{ statistics.marginGrowth }}% 较上期</p>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>收支趋势对比</h3>
        <div class="chart-container">
          <ECharts :option="trendChartOption" style="height: 350px" />
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>收入来源分析</h3>
        <div class="chart-container">
          <ECharts :option="incomeSourceOption" style="height: 300px" />
        </div>
      </div>

      <div class="chart-card">
        <h3>支出分类分析</h3>
        <div class="chart-container">
          <ECharts :option="expenseCategoryOption" style="height: 300px" />
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>月度收支对比</h3>
        <div class="chart-container">
          <ECharts :option="monthlyComparisonOption" style="height: 350px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ECharts from '@/components/ECharts/index.vue';
import { Wallet, ShoppingCart, Money, TrendCharts } from '@element-plus/icons-vue';

// 日期选择表单
const dateForm = ref({
  period: 'monthly',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  quarter: 1
});

// 可用年份
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
});

// 统计数据
const statistics = ref({
  totalIncome: 0,
  totalExpense: 0,
  netProfit: 0,
  profitMargin: 0,
  incomeGrowth: 0,
  expenseGrowth: 0,
  profitGrowth: 0,
  marginGrowth: 0
});

// 收支趋势图表配置
const trendChartOption = ref<any>({});

// 收入来源图表配置
const incomeSourceOption = ref<any>({});

// 支出分类图表配置
const expenseCategoryOption = ref<any>({});

// 月度收支对比图表配置
const monthlyComparisonOption = ref<any>({});

// 生成模拟数据
const generateMockData = () => {
  const { period, year, month, quarter } = dateForm.value;
  
  // 基础数据
  const baseIncome = 100000;
  const baseExpense = 60000;
  
  // 随机波动
  const income = baseIncome + Math.random() * 50000;
  const expense = baseExpense + Math.random() * 30000;
  const profit = income - expense;
  const margin = income > 0 ? (profit / income) * 100 : 0;
  
  // 模拟增长率
  const incomeGrowth = (Math.random() * 20 - 5).toFixed(1);
  const expenseGrowth = (Math.random() * 15 - 3).toFixed(1);
  const profitGrowth = (Math.random() * 25 - 5).toFixed(1);
  const marginGrowth = (Math.random() * 10 - 2).toFixed(1);
  
  return {
    totalIncome: income,
    totalExpense: expense,
    netProfit: profit,
    profitMargin: margin,
    incomeGrowth,
    expenseGrowth,
    profitGrowth,
    marginGrowth
  };
};

// 更新统计数据
const updateStatistics = () => {
  statistics.value = generateMockData();
};

// 更新图表配置
const updateCharts = () => {
  const { period, year, month, quarter } = dateForm.value;
  
  // 收支趋势图表
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const incomeData = months.map(() => Math.floor(Math.random() * 50000) + 10000);
  const expenseData = months.map(() => Math.floor(Math.random() * 30000) + 5000);
  
  trendChartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['收入', '支出']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '¥{value}' }
    },
    series: [
      {
        name: '收入',
        type: 'line',
        smooth: true,
        data: incomeData,
        itemStyle: { color: '#67c23a' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ]
          }
        }
      },
      {
        name: '支出',
        type: 'line',
        smooth: true,
        data: expenseData,
        itemStyle: { color: '#f56c6c' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
              { offset: 1, color: 'rgba(245, 108, 108, 0.05)' }
            ]
          }
        }
      }
    ]
  };
  
  // 收入来源图表
  incomeSourceOption.value = {
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
        name: '收入来源',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45000, name: '产品销售', itemStyle: { color: '#67c23a' } },
          { value: 35000, name: '服务收入', itemStyle: { color: '#409eff' } },
          { value: 20000, name: '投资收益', itemStyle: { color: '#e6a23c' } },
          { value: 15000, name: '其他收入', itemStyle: { color: '#909399' } }
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
  };
  
  // 支出分类图表
  expenseCategoryOption.value = {
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
        radius: ['40%', '70%'],
        data: [
          { value: 25000, name: '员工薪资', itemStyle: { color: '#67c23a' } },
          { value: 18000, name: '办公用品', itemStyle: { color: '#409eff' } },
          { value: 12000, name: '房租水电', itemStyle: { color: '#e6a23c' } },
          { value: 10000, name: '市场营销', itemStyle: { color: '#f56c6c' } },
          { value: 8000, name: '其他支出', itemStyle: { color: '#909399' } }
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
  };
  
  // 月度收支对比图表
  monthlyComparisonOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['收入', '支出', '净利润']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '¥{value}' }
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        data: incomeData,
        itemStyle: { color: '#67c23a' }
      },
      {
        name: '支出',
        type: 'bar',
        data: expenseData,
        itemStyle: { color: '#f56c6c' }
      },
      {
        name: '净利润',
        type: 'line',
        yAxisIndex: 1,
        data: incomeData.map((income, index) => income - expenseData[index]),
        itemStyle: { color: '#409eff' },
        lineStyle: { width: 3 },
        symbolSize: 8
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '收支金额',
        position: 'left',
        axisLabel: { formatter: '¥{value}' }
      },
      {
        type: 'value',
        name: '净利润',
        position: 'right',
        axisLabel: { formatter: '¥{value}' }
      }
    ]
  };
};

// 加载统计数据
const loadStatistics = () => {
  updateStatistics();
  updateCharts();
};

// 页面挂载时加载数据
onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.statistics-page {
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

.date-selector {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 24px;
  margin-right: 15px;
}

.stat-icon.income {
  background: #f0f9eb;
  color: #67c23a;
}

.stat-icon.expense {
  background: #fef0f0;
  color: #f56c6c;
}

.stat-icon.profit {
  background: #f0f9ff;
  color: #409eff;
}

.stat-icon.ratio {
  background: #faf5e6;
  color: #e6a23c;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}

.stat-value {
  margin: 0 0 5px 0;
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  width: 100%;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .date-selector {
    padding: 15px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>