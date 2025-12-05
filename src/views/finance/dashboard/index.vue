<template>
  <div class="finance-dashboard">
    <div class="page-title">财务仪表盘</div>
    <div class="dashboard-cards">
      <div class="card">
        <div class="card-icon income">
          <i class="iconfont icon-income"></i>
        </div>
        <div class="card-content">
          <div class="card-title">总收入</div>
          <div class="card-value">¥1,234,567.89</div>
          <div class="card-change positive">+12.5%</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon expense">
          <i class="iconfont icon-expense"></i>
        </div>
        <div class="card-content">
          <div class="card-title">总支出</div>
          <div class="card-value">¥890,123.45</div>
          <div class="card-change negative">-8.3%</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon profit">
          <i class="iconfont icon-profit"></i>
        </div>
        <div class="card-content">
          <div class="card-title">净利润</div>
          <div class="card-value">¥344,444.44</div>
          <div class="card-change positive">+15.2%</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon transactions">
          <i class="iconfont icon-transactions"></i>
        </div>
        <div class="card-content">
          <div class="card-title">交易次数</div>
          <div class="card-value">12,345</div>
          <div class="card-change positive">+5.7%</div>
        </div>
      </div>
    </div>
    <div class="dashboard-charts">
      <div class="chart-card">
        <div class="chart-title">收入趋势</div>
        <div class="chart-content">
          <canvas id="incomeChart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">支出分类</div>
        <div class="chart-content">
          <canvas id="expenseChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const incomeChart = ref<Chart | null>(null);
const expenseChart = ref<Chart | null>(null);

onMounted(() => {
  initCharts();
});

const initCharts = () => {
  // 收入趋势图表
  const incomeCtx = document.getElementById('incomeChart') as HTMLCanvasElement;
  if (incomeCtx) {
    incomeChart.value = new Chart(incomeCtx, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
          label: '收入',
          data: [150000, 180000, 220000, 250000, 280000, 320000],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // 支出分类图表
  const expenseCtx = document.getElementById('expenseChart') as HTMLCanvasElement;
  if (expenseCtx) {
    expenseChart.value = new Chart(expenseCtx, {
      type: 'doughnut',
      data: {
        labels: ['运营成本', '人员工资', '营销费用', '其他支出'],
        datasets: [{
          data: [450000, 280000, 120000, 40123.45],
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
};
</script>

<style scoped>
.finance-dashboard {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
}

.card-icon.income {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.card-icon.expense {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.card-icon.profit {
  background: rgba(78, 205, 196, 0.1);
  color: #4ECDC4;
}

.card-icon.transactions {
  background: rgba(69, 183, 209, 0.1);
  color: #45B7D1;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-change {
  font-size: 12px;
}

.card-change.positive {
  color: #4CAF50;
}

.card-change.negative {
  color: #FF6B6B;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.chart-content {
  height: 300px;
}

@media (max-width: 768px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}
</style>