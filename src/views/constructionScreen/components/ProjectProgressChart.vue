<template>
  <div class="project-progress-chart">
    <div class="progress-stats">
      <div class="stat-item">
        <div class="stat-label">项目总进度</div>
        <div class="stat-value">{{ totalProgress }}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">已完成阶段</div>
        <div class="stat-value completed">{{ completedStages }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">剩余天数</div>
        <div class="stat-value remaining">{{ remainingDays }}</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="ProjectProgressChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalProgress = ref(68);
const completedStages = ref(4);
const remainingDays = ref(85);

const progressData = ref([
  { stage: "项目立项", progress: 100, plannedDays: 30, actualDays: 28 },
  { stage: "设计阶段", progress: 100, plannedDays: 60, actualDays: 62 },
  { stage: "施工准备", progress: 100, plannedDays: 45, actualDays: 40 },
  { stage: "主体施工", progress: 75, plannedDays: 120, actualDays: 90 },
  { stage: "装饰装修", progress: 0, plannedDays: 90, actualDays: 0 },
  { stage: "竣工验收", progress: 0, plannedDays: 30, actualDays: 0 },
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
        const stageData = progressData.value.find(item => item.stage === params[0].name);
        if (!stageData) return "";

        return `${stageData.stage}<br/>进度: ${stageData.progress}%<br/>计划天数: ${stageData.plannedDays}天<br/>实际天数: ${stageData.actualDays}天`;
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
      data: progressData.value.map(item => item.stage),
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
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 12,
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.2)",
        },
      },
    },
    series: [
      {
        name: "项目进度",
        type: "bar",
        data: progressData.value.map(item => ({
          value: item.progress,
          itemStyle: {
            color: item.progress === 100 ? "#00ff00" : item.progress > 0 ? "#ff9f1c" : "#666",
          },
        })),
        barWidth: "60%",
        label: {
          show: true,
          position: "top",
          color: "#fff",
          fontSize: 12,
          formatter: "{c}%",
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const ongoingStageIndex = progressData.value.findIndex(item => item.progress > 0 && item.progress < 100);
  if (ongoingStageIndex !== -1) {
    // 模拟主体施工阶段进度增加
    const progressIncrease = Math.floor(Math.random() * 3) + 1; // 1-3% 增加
    progressData.value[ongoingStageIndex].progress = Math.min(100, progressData.value[ongoingStageIndex].progress + progressIncrease);
    progressData.value[ongoingStageIndex].actualDays += 1;

    // 更新项目总进度
    const totalPlannedDays = progressData.value.reduce((sum, item) => sum + item.plannedDays, 0);
    const totalActualDays = progressData.value.reduce((sum, item) => sum + item.actualDays, 0);
    totalProgress.value = Math.floor((totalActualDays / totalPlannedDays) * 100);

    // 更新剩余天数
    remainingDays.value = totalPlannedDays - totalActualDays;

    // 如果当前阶段完成，更新已完成阶段数量
    if (progressData.value[ongoingStageIndex].progress === 100) {
      completedStages.value += 1;
    }

    if (chartInstance) {
      chartInstance.setOption({
        xAxis: {
          data: progressData.value.map(item => item.stage),
        },
        series: [
          {
            data: progressData.value.map(item => ({
              value: item.progress,
              itemStyle: {
                color: item.progress === 100 ? "#00ff00" : item.progress > 0 ? "#ff9f1c" : "#666",
              },
            })),
          },
        ],
      });
    }
  }
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => chartInstance?.resize());

  // 每4分钟更新一次数据
  const timer = setInterval(updateChart, 240000);

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
.project-progress-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.progress-stats {
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
    .completed {
      color: #00ff00;
    }
    .remaining {
      color: #ff9f1c;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>