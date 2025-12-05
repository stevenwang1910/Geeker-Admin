<template>
  <div class="finance-reports">
    <div class="page-title">财务报表</div>
    <div class="report-tabs">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="月度报表" name="monthly">
          <div class="report-content">
            <div class="report-header">
              <el-form :model="monthlyForm" inline>
                <el-form-item label="年份">
                  <el-select v-model="monthlyForm.year" placeholder="请选择年份">
                    <el-option label="2023" value="2023"></el-option>
                    <el-option label="2024" value="2024"></el-option>
                    <el-option label="2025" value="2025"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="月份">
                  <el-select v-model="monthlyForm.month" placeholder="请选择月份">
                    <el-option label="1月" value="1"></el-option>
                    <el-option label="2月" value="2"></el-option>
                    <el-option label="3月" value="3"></el-option>
                    <el-option label="4月" value="4"></el-option>
                    <el-option label="5月" value="5"></el-option>
                    <el-option label="6月" value="6"></el-option>
                    <el-option label="7月" value="7"></el-option>
                    <el-option label="8月" value="8"></el-option>
                    <el-option label="9月" value="9"></el-option>
                    <el-option label="10月" value="10"></el-option>
                    <el-option label="11月" value="11"></el-option>
                    <el-option label="12月" value="12"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateMonthlyReport">生成报表</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="report-body">
              <div class="report-summary">
                <div class="summary-item">
                  <div class="summary-label">总收入</div>
                  <div class="summary-value income">¥320,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">总支出</div>
                  <div class="summary-value expense">¥210,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">净利润</div>
                  <div class="summary-value profit">¥110,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">利润率</div>
                  <div class="summary-value rate">34.38%</div>
                </div>
              </div>
              <div class="report-charts">
                <div class="chart-card">
                  <div class="chart-title">收入构成</div>
                  <div class="chart-content">
                    <canvas id="incomeCompositionChart"></canvas>
                  </div>
                </div>
                <div class="chart-card">
                  <div class="chart-title">支出构成</div>
                  <div class="chart-content">
                    <canvas id="expenseCompositionChart"></canvas>
                  </div>
                </div>
              </div>
              <div class="report-table">
                <el-table :data="monthlyData" border style="width: 100%">
                  <el-table-column prop="date" label="日期" width="120"></el-table-column>
                  <el-table-column prop="income" label="收入" width="120">
                    <template #default="scope">
                      <span class="income-amount">¥{{ scope.row.income.toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="expense" label="支出" width="120">
                    <template #default="scope">
                      <span class="expense-amount">¥{{ scope.row.expense.toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="profit" label="利润" width="120">
                    <template #default="scope">
                      <span :class="scope.row.profit >= 0 ? 'profit-amount' : 'loss-amount'">
                        ¥{{ scope.row.profit.toFixed(2) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="说明"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="季度报表" name="quarterly">
          <div class="report-content">
            <div class="report-header">
              <el-form :model="quarterlyForm" inline>
                <el-form-item label="年份">
                  <el-select v-model="quarterlyForm.year" placeholder="请选择年份">
                    <el-option label="2023" value="2023"></el-option>
                    <el-option label="2024" value="2024"></el-option>
                    <el-option label="2025" value="2025"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="季度">
                  <el-select v-model="quarterlyForm.quarter" placeholder="请选择季度">
                    <el-option label="第一季度" value="1"></el-option>
                    <el-option label="第二季度" value="2"></el-option>
                    <el-option label="第三季度" value="3"></el-option>
                    <el-option label="第四季度" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateQuarterlyReport">生成报表</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="report-body">
              <div class="report-summary">
                <div class="summary-item">
                  <div class="summary-label">总收入</div>
                  <div class="summary-value income">¥950,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">总支出</div>
                  <div class="summary-value expense">¥650,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">净利润</div>
                  <div class="summary-value profit">¥300,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">利润率</div>
                  <div class="summary-value rate">31.58%</div>
                </div>
              </div>
              <div class="report-charts">
                <div class="chart-card">
                  <div class="chart-title">季度趋势</div>
                  <div class="chart-content">
                    <canvas id="quarterlyTrendChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="年度报表" name="yearly">
          <div class="report-content">
            <div class="report-header">
              <el-form :model="yearlyForm" inline>
                <el-form-item label="年份">
                  <el-select v-model="yearlyForm.year" placeholder="请选择年份">
                    <el-option label="2023" value="2023"></el-option>
                    <el-option label="2024" value="2024"></el-option>
                    <el-option label="2025" value="2025"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateYearlyReport">生成报表</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="report-body">
              <div class="report-summary">
                <div class="summary-item">
                  <div class="summary-label">总收入</div>
                  <div class="summary-value income">¥3,800,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">总支出</div>
                  <div class="summary-value expense">¥2,600,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">净利润</div>
                  <div class="summary-value profit">¥1,200,000.00</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">利润率</div>
                  <div class="summary-value rate">31.58%</div>
                </div>
              </div>
              <div class="report-charts">
                <div class="chart-card">
                  <div class="chart-title">年度趋势</div>
                  <div class="chart-content">
                    <canvas id="yearlyTrendChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import Chart from 'chart.js/auto';

const activeTab = ref('monthly');

const monthlyForm = reactive({
  year: '2023',
  month: '6'
});

const quarterlyForm = reactive({
  year: '2023',
  quarter: '2'
});

const yearlyForm = reactive({
  year: '2023'
});

const monthlyData = ref<any[]>([]);

onMounted(() => {
  loadMonthlyData();
  initCharts();
});

watch(activeTab, (newTab) => {
  setTimeout(() => {
    initCharts();
  }, 100);
});

const loadMonthlyData = () => {
  // 模拟数据
  const mockData = [
    { date: '2023-06-01', income: 15000, expense: 8000, profit: 7000, description: '项目A回款' },
    { date: '2023-06-05', income: 22000, expense: 12000, profit: 10000, description: '产品销售' },
    { date: '2023-06-10', income: 18000, expense: 9000, profit: 9000, description: '服务收入' },
    { date: '2023-06-15', income: 25000, expense: 15000, profit: 10000, description: '项目B回款' },
    { date: '2023-06-20', income: 16000, expense: 10000, profit: 6000, description: '产品销售' },
    { date: '2023-06-25', income: 24000, expense: 13000, profit: 11000, description: '服务收入' },
    { date: '2023-06-30', income: 20000, expense: 11000, profit: 9000, description: '项目C回款' }
  ];
  monthlyData.value = mockData;
};

const generateMonthlyReport = () => {
  ElMessage.success('月度报表生成成功');
};

const generateQuarterlyReport = () => {
  ElMessage.success('季度报表生成成功');
};

const generateYearlyReport = () => {
  ElMessage.success('年度报表生成成功');
};

const initCharts = () => {
  // 收入构成图表
  const incomeCompositionCtx = document.getElementById('incomeCompositionChart') as HTMLCanvasElement;
  if (incomeCompositionCtx) {
    new Chart(incomeCompositionCtx, {
      type: 'doughnut',
      data: {
        labels: ['项目收入', '产品销售', '服务收入', '其他收入'],
        datasets: [{
          data: [150000, 100000, 60000, 10000],
          backgroundColor: ['#4CAF50', '#4ECDC4', '#45B7D1', '#96CEB4'],
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

  // 支出构成图表
  const expenseCompositionCtx = document.getElementById('expenseCompositionChart') as HTMLCanvasElement;
  if (expenseCompositionCtx) {
    new Chart(expenseCompositionCtx, {
      type: 'doughnut',
      data: {
        labels: ['运营成本', '人员工资', '营销费用', '办公费用'],
        datasets: [{
          data: [80000, 70000, 40000, 20000],
          backgroundColor: ['#FF6B6B', '#FF8E53', '#FFD93D', '#96CEB4'],
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

  // 季度趋势图表
  const quarterlyTrendCtx = document.getElementById('quarterlyTrendChart') as HTMLCanvasElement;
  if (quarterlyTrendCtx) {
    new Chart(quarterlyTrendCtx, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '收入',
            data: [250000, 280000, 300000, 320000, 350000, 380000],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: '支出',
            data: [180000, 200000, 210000, 220000, 230000, 240000],
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
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

  // 年度趋势图表
  const yearlyTrendCtx = document.getElementById('yearlyTrendChart') as HTMLCanvasElement;
  if (yearlyTrendCtx) {
    new Chart(yearlyTrendCtx, {
      type: 'bar',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
          {
            label: '收入',
            data: [250000, 280000, 300000, 320000, 350000, 380000, 400000, 420000, 450000, 480000, 500000, 550000],
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            borderRadius: 4
          },
          {
            label: '支出',
            data: [180000, 200000, 210000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 300000],
            backgroundColor: 'rgba(255, 107, 107, 0.8)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
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
};
</script>

<style scoped>
.finance-reports {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.report-tabs {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.report-content {
  padding: 20px 0;
}

.report-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.report-body {
  margin-top: 20px;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
}

.summary-value.income {
  color: #4CAF50;
}

.summary-value.expense {
  color: #FF6B6B;
}

.summary-value.profit {
  color: #4ECDC4;
}

.summary-value.rate {
  color: #45B7D1;
}

.report-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #f5f7fa;
  border-radius: 8px;
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

.report-table {
  margin-top: 20px;
}

.income-amount {
  color: #4CAF50;
  font-weight: 600;
}

.expense-amount {
  color: #FF6B6B;
  font-weight: 600;
}

.profit-amount {
  color: #4ECDC4;
  font-weight: 600;
}

.loss-amount {
  color: #FF6B6B;
  font-weight: 600;
}

@media (max-width: 768px) {
  .report-charts {
    grid-template-columns: 1fr;
  }
}
</style>