<template>
  <div class="cost-control-chart">
    <div class="cost-stats">
      <div class="stat-item">
        <div class="stat-label">总预算</div>
        <div class="stat-value">¥{{ totalBudget }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">实际成本</div>
        <div class="stat-value actual">{{ actualCost }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">成本偏差率</div>
        <div class="stat-value deviation">{{ costDeviation }}%</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="CostControlChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalBudget = ref(12500000);
const actualCost = ref(8560000);
const costDeviation = ref(-26.48);

const costData = ref([
  { name: "人工成本", budget: 3500000, actual: 2800000 },
  { name: "材料成本", budget: 5000000, actual: 4200000 },
  { name: "设备成本", budget: 1500000, actual: 1000000 },
  { name: "管理成本", budget: 1000000, actual: 400000 },
  { name: "其他成本", budget: 500000, actual: 160000 },
]);

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  const option: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#ff9f1c",
      textStyle: {
        color: "#fff",
      },
      formatter: (params: any) => {
        const budgetData = costData.value.find(item => item.name === params[0].name);
        if (!budgetData) return "";

        const deviation = ((budgetData.actual - budgetData.budget) / budgetData.budget) * 100;

        return `${budgetData.name}<br/>预算: ¥${budgetData.budget.toLocaleString()}<br/>实际: ¥${budgetData.actual.toLocaleString()}<br/>偏差: ${deviation.toFixed(2)}%`;
      },
    },
    legend: {
      orient: "horizontal",
      top: "5%",
      left: "center",
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: costData.value.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 12,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 12,
        formatter: "¥{value}",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.2)",
        },
      },
    },
    series: [
      {
        name: "预算",
        type: "bar",
        data: costData.value.map(item => item.budget),
        itemStyle: {
          color: "#ff9f1c",
        },
        barWidth: "30%",
        label: {
          show: true,
          position: "top",
          color: "#ff9f1c",
          fontSize: 10,
          formatter: "¥{c}",
        },
      },
      {
        name: "实际",
        type: "bar",
        data: costData.value.map(item => item.actual),
        itemStyle: {
          color: "#00ff00",
        },
        barWidth: "30%",
        label: {
          show: true,
          position: "bottom",
          color: "#00ff00",
          fontSize: 10,
          formatter: "¥{c}",
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * costData.value.length);
  const randomChange = Math.floor(Math.random() * 100000) + 50000; // 50,000 - 150,000 增加

  costData.value[randomIndex].actual += randomChange;

  // 更新统计数据
  actualCost.value = costData.value.reduce((sum, item) => sum + item.actual, 0);
  costDeviation.value = Math.round((((actualCost.value - totalBudget.value) / totalBudget.value) * 100) * 100) / 100;

  if (chartInstance) {
    chartInstance.setOption({
      xAxis: {
        data: costData.value.map(item => item.name),
      },
      series: [
        {
          data: costData.value.map(item => item.budget),
        },
        {
          data: costData.value.map(item => item.actual),
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => chartInstance?.resize());

  // 每10分钟更新一次数据
  const timer = setInterval(updateChart, 600000);

  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
  window.removeEventListener("resize", () => chartInstance?.resize());
});
</script>

<style lang="scss" scoped>
.cost-control-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cost-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .stat-label {
      font-size: 12px;
      color: #fff;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 20px;
      font-weight: bold;
    }
    .actual {
      color: #00ff00;
    }
    .deviation {
      color: #ff9f1c;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>