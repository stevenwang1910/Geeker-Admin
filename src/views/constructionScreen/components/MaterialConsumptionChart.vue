<template>
  <div class="material-consumption-chart">
    <div class="consumption-stats">
      <div class="stat-item">
        <div class="stat-label">总材料消耗</div>
        <div class="stat-value">{{ totalConsumption }}吨</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">本月消耗</div>
        <div class="stat-value monthly">{{ monthlyConsumption }}吨</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">材料成本</div>
        <div class="stat-value cost">¥{{ materialCost }}</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="MaterialConsumptionChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalConsumption = ref(12560);
const monthlyConsumption = ref(1890);
const materialCost = ref(8560000);

const consumptionData = ref([
  { name: "水泥", total: 3200, monthly: 480, unitPrice: 580 },
  { name: "钢筋", total: 4500, monthly: 670, unitPrice: 4200 },
  { name: "砂石", total: 3800, monthly: 560, unitPrice: 120 },
  { name: "砖块", total: 750, monthly: 110, unitPrice: 80 },
  { name: "木材", total: 150, monthly: 30, unitPrice: 1500 },
  { name: "其他", total: 30, monthly: 10, unitPrice: 5000 },
]);

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  const option: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#ff9f1c",
      textStyle: {
        color: "#fff",
      },
      formatter: (params: any) => {
        const materialData = consumptionData.value.find(item => item.name === params.name);
        if (!materialData) return "";

        const totalCost = materialData.total * materialData.unitPrice;
        const monthlyCost = materialData.monthly * materialData.unitPrice;

        return `${materialData.name}<br/>总消耗: ${materialData.total}吨<br/>本月消耗: ${materialData.monthly}吨<br/>单价: ¥${materialData.unitPrice}/吨<br/>总成本: ¥${totalCost.toLocaleString()}<br/>本月成本: ¥${monthlyCost.toLocaleString()}`;
      },
    },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "center",
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
    },
    series: [
      {
        name: "材料消耗",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#000",
          borderWidth: 2,
        },
        label: {
          show: true,
          color: "#fff",
          fontSize: 12,
          formatter: "{b}: {d}%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        data: consumptionData.value.map(item => ({
          name: item.name,
          value: item.total,
          itemStyle: {
            color: getMaterialColor(item.name),
          },
        })),
      },
    ],
  };

  chartInstance.setOption(option);
};

// 获取材料对应的颜色
const getMaterialColor = (materialName: string) => {
  const colorMap: Record<string, string> = {
    水泥: "#8b4513",
    钢筋: "#c0c0c0",
    砂石: "#deb887",
    砖块: "#a0522d",
    木材: "#8fbc8f",
    其他: "#696969",
  };

  return colorMap[materialName] || "#666";
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * consumptionData.value.length);
  const randomChange = Math.floor(Math.random() * 50) + 10; // 10-60 吨增加

  consumptionData.value[randomIndex].total += randomChange;
  consumptionData.value[randomIndex].monthly += randomChange;

  // 更新统计数据
  totalConsumption.value = consumptionData.value.reduce((sum, item) => sum + item.total, 0);
  monthlyConsumption.value = consumptionData.value.reduce((sum, item) => sum + item.monthly, 0);
  materialCost.value = consumptionData.value.reduce((sum, item) => sum + (item.total * item.unitPrice), 0);

  if (chartInstance) {
    chartInstance.setOption({
      series: [
        {
          data: consumptionData.value.map(item => ({
            name: item.name,
            value: item.total,
            itemStyle: {
              color: getMaterialColor(item.name),
            },
          })),
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => chartInstance?.resize());

  // 每5分钟更新一次数据
  const timer = setInterval(updateChart, 300000);

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
.material-consumption-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.consumption-stats {
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
    .monthly {
      color: #ff9f1c;
    }
    .cost {
      color: #00ff00;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>