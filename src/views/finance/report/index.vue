<template>
  <div class="report-page">
    <div class="page-header">
      <h2>财务报表</h2>
      <p>生成和查看各种财务报表</p>
      <el-button type="primary" @click="handleGenerateReport">生成报表</el-button>
    </div>

    <div class="report-filters">
      <el-form :model="filterForm" inline>
        <el-form-item label="报表类型">
          <el-select v-model="filterForm.reportType" placeholder="请选择报表类型" style="width: 180px" @change="loadReportData">
            <el-option label="资产负债表" value="balanceSheet" />
            <el-option label="利润表" value="incomeStatement" />
            <el-option label="现金流量表" value="cashFlow" />
            <el-option label="收支明细表" value="detail" />
          </el-select>
        </el-form-item>

        <el-form-item label="报表周期">
          <el-select v-model="filterForm.period" placeholder="请选择报表周期" style="width: 150px" @change="loadReportData">
            <el-option label="月度" value="monthly" />
            <el-option label="季度" value="quarterly" />
            <el-option label="年度" value="yearly" />
          </el-select>
        </el-form-item>

        <el-form-item label="年份">
          <el-select v-model="filterForm.year" placeholder="请选择年份" style="width: 120px" @change="loadReportData">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year + '年'"
              :value="year"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="月份" v-if="filterForm.period === 'monthly'">
          <el-select v-model="filterForm.month" placeholder="请选择月份" style="width: 120px" @change="loadReportData">
            <el-option
              v-for="month in 12"
              :key="month"
              :label="month + '月'"
              :value="month"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="季度" v-if="filterForm.period === 'quarterly'">
          <el-select v-model="filterForm.quarter" placeholder="请选择季度" style="width: 120px" @change="loadReportData">
            <el-option label="第一季度" value="1" />
            <el-option label="第二季度" value="2" />
            <el-option label="第三季度" value="3" />
            <el-option label="第四季度" value="4" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="handleExport">导出报表</el-button>
          <el-button @click="handlePrint">打印报表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="report-content" v-loading="loading">
      <!-- 资产负债表 -->
      <div v-if="filterForm.reportType === 'balanceSheet'" class="balance-sheet">
        <div class="report-title">
          <h3>{{ filterForm.year }}年{{ getPeriodText() }}资产负债表</h3>
          <p>单位：元</p>
        </div>

        <div class="balance-sheet-grid">
          <div class="sheet-section">
            <h4>资产</h4>
            <el-table :data="balanceSheet.assets" border stripe>
              <el-table-column prop="name" label="资产项目" />
              <el-table-column prop="amount" label="金额" width="150" align="right">
                <template #default="{ row }">
                  ¥{{ row.amount.toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
            <div class="sheet-total">
              <span>资产总计：</span>
              <span class="total-amount">¥{{ balanceSheet.totalAssets.toFixed(2) }}</span>
            </div>
          </div>

          <div class="sheet-section">
            <h4>负债及所有者权益</h4>
            <el-table :data="balanceSheet.liabilities" border stripe>
              <el-table-column prop="name" label="负债及所有者权益项目" />
              <el-table-column prop="amount" label="金额" width="150" align="right">
                <template #default="{ row }">
                  ¥{{ row.amount.toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
            <div class="sheet-total">
              <span>负债及所有者权益总计：</span>
              <span class="total-amount">¥{{ balanceSheet.totalLiabilities.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 利润表 -->
      <div v-if="filterForm.reportType === 'incomeStatement'" class="income-statement">
        <div class="report-title">
          <h3>{{ filterForm.year }}年{{ getPeriodText() }}利润表</h3>
          <p>单位：元</p>
        </div>

        <el-table :data="incomeStatement" border stripe>
          <el-table-column prop="name" label="项目" />
          <el-table-column prop="amount" label="金额" width="150" align="right">
            <template #default="{ row }">
              ¥{{ row.amount.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 现金流量表 -->
      <div v-if="filterForm.reportType === 'cashFlow'" class="cash-flow">
        <div class="report-title">
          <h3>{{ filterForm.year }}年{{ getPeriodText() }}现金流量表</h3>
          <p>单位：元</p>
        </div>

        <el-table :data="cashFlow" border stripe>
          <el-table-column prop="name" label="项目" />
          <el-table-column prop="amount" label="金额" width="150" align="right">
            <template #default="{ row }">
              ¥{{ row.amount.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 收支明细表 -->
      <div v-if="filterForm.reportType === 'detail'" class="detail-report">
        <div class="report-title">
          <h3>{{ filterForm.year }}年{{ getPeriodText() }}收支明细表</h3>
          <p>单位：元</p>
        </div>

        <el-table :data="detailReport" border stripe>
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === '收入' ? 'success' : 'danger'">
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="amount" label="金额" width="120" align="right">
            <template #default="{ row }">
              <span :class="row.type === '收入' ? 'text-success' : 'text-danger'">
                {{ row.type === '收入' ? '+' : '-' }}¥{{ row.amount.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" width="120" align="right">
            <template #default="{ row }">
              ¥{{ row.balance.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>

        <div class="detail-summary">
          <div class="summary-item">
            <span>总收入：</span>
            <span class="text-success">¥{{ detailSummary.totalIncome.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span>总支出：</span>
            <span class="text-danger">¥{{ detailSummary.totalExpense.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span>净收支：</span>
            <span :class="detailSummary.netIncome >= 0 ? 'text-success' : 'text-danger'">
              ¥{{ detailSummary.netIncome.toFixed(2) }}
            </span>
          </div>
          <div class="summary-item">
            <span>期末余额：</span>
            <span>¥{{ detailSummary.endingBalance.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 报表筛选表单
const filterForm = ref({
  reportType: 'incomeStatement',
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

// 加载状态
const loading = ref(false);

// 资产负债表数据
const balanceSheet = ref({
  assets: [
    { name: '流动资产', amount: 1500000 },
    { name: '固定资产', amount: 2500000 },
    { name: '无形资产', amount: 500000 },
    { name: '其他资产', amount: 300000 }
  ],
  liabilities: [
    { name: '流动负债', amount: 800000 },
    { name: '长期负债', amount: 1200000 },
    { name: '所有者权益', amount: 2800000 }
  ],
  totalAssets: 0,
  totalLiabilities: 0
});

// 利润表数据
const incomeStatement = ref([
  { name: '一、营业收入', amount: 5000000 },
  { name: '减：营业成本', amount: 3000000 },
  { name: '营业税金及附加', amount: 250000 },
  { name: '销售费用', amount: 300000 },
  { name: '管理费用', amount: 400000 },
  { name: '财务费用', amount: 100000 },
  { name: '资产减值损失', amount: 50000 },
  { name: '加：公允价值变动收益', amount: 80000 },
  { name: '投资收益', amount: 120000 },
  { name: '二、营业利润', amount: 1100000 },
  { name: '加：营业外收入', amount: 150000 },
  { name: '减：营业外支出', amount: 80000 },
  { name: '三、利润总额', amount: 1170000 },
  { name: '减：所得税费用', amount: 292500 },
  { name: '四、净利润', amount: 877500 }
]);

// 现金流量表数据
const cashFlow = ref([
  { name: '一、经营活动产生的现金流量', amount: 1200000 },
  { name: '销售商品、提供劳务收到的现金', amount: 5500000 },
  { name: '收到的税费返还', amount: 150000 },
  { name: '收到其他与经营活动有关的现金', amount: 100000 },
  { name: '经营活动现金流入小计', amount: 5750000 },
  { name: '购买商品、接受劳务支付的现金', amount: 3200000 },
  { name: '支付给职工以及为职工支付的现金', amount: 800000 },
  { name: '支付的各项税费', amount: 500000 },
  { name: '支付其他与经营活动有关的现金', amount: 250000 },
  { name: '经营活动现金流出小计', amount: 4750000 },
  { name: '经营活动产生的现金流量净额', amount: 1000000 },
  { name: '二、投资活动产生的现金流量', amount: -300000 },
  { name: '三、筹资活动产生的现金流量', amount: 500000 },
  { name: '四、汇率变动对现金及现金等价物的影响', amount: 0 },
  { name: '五、现金及现金等价物净增加额', amount: 1200000 },
  { name: '加：期初现金及现金等价物余额', amount: 800000 },
  { name: '六、期末现金及现金等价物余额', amount: 2000000 }
]);

// 收支明细表数据
const detailReport = ref([]);

// 收支明细汇总
const detailSummary = ref({
  totalIncome: 0,
  totalExpense: 0,
  netIncome: 0,
  endingBalance: 0
});

// 获取周期文本
const getPeriodText = () => {
  const { period, month, quarter } = filterForm.value;
  if (period === 'monthly') {
    return `${month}月`;
  } else if (period === 'quarterly') {
    return `第${quarter}季度`;
  } else {
    return '';
  }
};

// 生成模拟收支明细数据
const generateDetailReport = () => {
  const data = [];
  let balance = 1000000; // 期初余额
  const totalIncome = 0;
  const totalExpense = 0;

  for (let i = 1; i <= 30; i++) {
    const isIncome = Math.random() > 0.6;
    const amount = Math.floor(Math.random() * 50000) + 1000;
    
    if (isIncome) {
      balance += amount;
    } else {
      balance -= amount;
    }

    data.push({
      date: `${filterForm.value.year}-${String(filterForm.value.month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      type: isIncome ? '收入' : '支出',
      category: isIncome ? ['产品销售', '服务收入', '投资收益'][Math.floor(Math.random() * 3)] : ['办公用品', '员工薪资', '房租水电', '市场营销'][Math.floor(Math.random() * 4)],
      description: isIncome ? `收入款项 ${i}` : `支出款项 ${i}`,
      amount,
      balance
    });
  }

  return data;
};

// 计算收支明细汇总
const calculateDetailSummary = (data: any[]) => {
  const totalIncome = data.filter(item => item.type === '收入').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = data.filter(item => item.type === '支出').reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalIncome - totalExpense;
  const endingBalance = data.length > 0 ? data[data.length - 1].balance : 0;

  return {
    totalIncome,
    totalExpense,
    netIncome,
    endingBalance
  };
};

// 计算资产负债表总计
const calculateBalanceSheetTotal = () => {
  const totalAssets = balanceSheet.value.assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = balanceSheet.value.liabilities.reduce((sum, item) => sum + item.amount, 0);
  
  balanceSheet.value.totalAssets = totalAssets;
  balanceSheet.value.totalLiabilities = totalLiabilities;
};

// 加载报表数据
const loadReportData = () => {
  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    if (filterForm.value.reportType === 'detail') {
      detailReport.value = generateDetailReport();
      detailSummary.value = calculateDetailSummary(detailReport.value);
    } else if (filterForm.value.reportType === 'balanceSheet') {
      calculateBalanceSheetTotal();
    }
    
    loading.value = false;
  }, 500);
};

// 生成报表
const handleGenerateReport = () => {
  loadReportData();
  ElMessage.success('报表生成成功');
};

// 导出报表
const handleExport = () => {
  ElMessage.info('导出报表功能开发中...');
};

// 打印报表
const handlePrint = () => {
  window.print();
};

// 页面挂载时加载数据
onMounted(() => {
  loadReportData();
});
</script>

<style scoped>
.report-page {
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

.report-filters {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.report-title {
  text-align: center;
  margin-bottom: 20px;
}

.report-title h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
  font-weight: 600;
}

.report-title p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.balance-sheet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.sheet-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.sheet-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #e6e6e6;
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  margin-left: 10px;
  font-size: 18px;
}

.detail-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.summary-item {
  margin-left: 30px;
  font-size: 14px;
  font-weight: 500;
}

.summary-item:first-child {
  margin-left: 0;
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

  .report-filters {
    padding: 15px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .report-content {
    padding: 15px;
    overflow-x: auto;
  }

  .balance-sheet-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .detail-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-item {
    margin-left: 0;
    margin-bottom: 10px;
  }

  .summary-item:last-child {
    margin-bottom: 0;
  }
}
</style>