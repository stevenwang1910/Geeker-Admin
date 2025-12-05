<template>
  <div class="real-time-personnel-chart">
    <div class="personnel-stats">
      <div class="stat-item">
        <div class="stat-label">总施工人员</div>
        <div class="stat-value">{{ totalPersonnel }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">在场人员</div>
        <div class="stat-value">{{ onSitePersonnel }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">离场人员</div>
        <div class="stat-value">{{ offSitePersonnel }}</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="RealTimePersonnelChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalPersonnel = ref(286);
const onSitePersonnel = ref(218);
const offSitePersonnel = ref(68);

const personnelData = ref([
  { time: "08:00", count: 120 },
  { time: "09:00", count: 156 },
  { time: "10:00", count: 189 },
  { time: "11:00", count: 205 },
  { time: "12:00", count: 145 },
  { time: "13:00", count: 168 },
  { time: "14:00", count: 192 },
  { time: "15:00", count: 218 },
]);

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  const option: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#ff9f1c",
      textStyle: {
        color: "#fff",
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
      data: personnelData.value.map(item => item.time),
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 12,
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
        name: "施工人员",
        type: "line",
        smooth: true,
        data: personnelData.value.map(item => item.count),
        itemStyle: {
          color: "#ff9f1c",
        },
        lineStyle: {
          color: "#ff9f1c",
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255, 159, 28, 0.5)" },
            { offset: 1, color: "rgba(255, 159, 28, 0.1)" },
          ]),
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTime = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  // 随机更新在场人员数量
  onSitePersonnel.value = Math.floor(Math.random() * 50) + 180;
  offSitePersonnel.value = totalPersonnel.value - onSitePersonnel.value;

  // 更新图表数据
  if (personnelData.value.length >= 8) {
    personnelData.value.shift();
  }
  personnelData.value.push({
    time: currentTime,
    count: onSitePersonnel.value,
  });

  if (chartInstance) {
    chartInstance.setOption({
      xAxis: {
        data: personnelData.value.map(item => item.time),
      },
      series: [
        {
          data: personnelData.value.map(item => item.count),
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => chartInstance?.resize());

  // 每30秒更新一次数据
  const timer = setInterval(updateChart, 30000);

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
.real-time-personnel-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.personnel-stats {
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
      color: #ff9f1c;
      font-weight: bold;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>