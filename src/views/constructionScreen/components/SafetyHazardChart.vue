<template>
  <div class="safety-hazard-chart">
    <div class="hazard-stats">
      <div class="stat-item">
        <div class="stat-label">隐患总数</div>
        <div class="stat-value">{{ totalHazards }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">已处理</div>
        <div class="stat-value resolved">{{ resolvedHazards }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">待处理</div>
        <div class="stat-value pending">{{ pendingHazards }}</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="SafetyHazardChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalHazards = ref(67);
const resolvedHazards = ref(45);
const pendingHazards = ref(22);

const hazardData = ref([
  { name: "高处坠落", count: 12, severity: "high" },
  { name: "物体打击", count: 8, severity: "high" },
  { name: "触电", count: 6, severity: "high" },
  { name: "机械伤害", count: 5, severity: "medium" },
  { name: "坍塌", count: 4, severity: "high" },
  { name: "火灾爆炸", count: 3, severity: "high" },
  { name: "中毒窒息", count: 2, severity: "high" },
  { name: "其他", count: 5, severity: "low" },
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
        let severityText = "";
        let severityColor = "";

        if (params[0].data.severity === "high") {
          severityText = "高风险";
          severityColor = "#ff0000";
        } else if (params[0].data.severity === "medium") {
          severityText = "中风险";
          severityColor = "#ff9f1c";
        } else if (params[0].data.severity === "low") {
          severityText = "低风险";
          severityColor = "#00ff00";
        }

        return `${params[0].name}<br/>数量: ${params[0].value}<br/>风险等级: <span style="color: ${severityColor}">${severityText}</span>`;
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: hazardData.value.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 10,
        rotate: 45,
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
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.2)",
        },
      },
    },
    series: [
      {
        name: "安全隐患",
        type: "bar",
        data: hazardData.value.map(item => ({
          value: item.count,
          severity: item.severity,
          itemStyle: {
            color: item.severity === "high" ? "#ff0000" : item.severity === "medium" ? "#ff9f1c" : "#00ff00",
          },
        })),
        barWidth: "60%",
        label: {
          show: true,
          position: "top",
          color: "#fff",
          fontSize: 10,
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * hazardData.value.length);
  const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, 1

  hazardData.value[randomIndex].count = Math.max(0, hazardData.value[randomIndex].count + randomChange);

  // 更新统计数据
  totalHazards.value = hazardData.value.reduce((sum, item) => sum + item.count, 0);
  // 模拟已处理和待处理的比例
  resolvedHazards.value = Math.floor(totalHazards.value * 0.67);
  pendingHazards.value = totalHazards.value - resolvedHazards.value;

  if (chartInstance) {
    chartInstance.setOption({
      xAxis: {
        data: hazardData.value.map(item => item.name),
      },
      series: [
        {
          data: hazardData.value.map(item => ({
            value: item.count,
            severity: item.severity,
            itemStyle: {
              color: item.severity === "high" ? "#ff0000" : item.severity === "medium" ? "#ff9f1c" : "#00ff00",
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

  // 每2分钟更新一次数据
  const timer = setInterval(updateChart, 120000);

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
.safety-hazard-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hazard-stats {
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
    .resolved {
      color: #00ff00;
    }
    .pending {
      color: #ff0000;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>