<template>
  <div class="construction-quality-chart">
    <div class="quality-stats">
      <div class="stat-item">
        <div class="stat-label">整体质量评分</div>
        <div class="stat-value">{{ overallScore }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">质量等级</div>
        <div class="stat-value grade">{{ qualityGrade }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">合格分项工程</div>
        <div class="stat-value qualified">{{ qualifiedItems }}项</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="ConstructionQualityChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const overallScore = ref(89.5);
const qualityGrade = ref("优良");
const qualifiedItems = ref(12);

const qualityData = ref([
  { name: "地基与基础", score: 92, status: "excellent" },
  { name: "主体结构", score: 88, status: "good" },
  { name: "建筑装饰装修", score: 85, status: "good" },
  { name: "建筑屋面", score: 90, status: "excellent" },
  { name: "建筑给水排水及供暖", score: 87, status: "good" },
  { name: "建筑电气", score: 89, status: "good" },
  { name: "智能建筑", score: 91, status: "excellent" },
  { name: "通风与空调", score: 86, status: "good" },
  { name: "电梯", score: 93, status: "excellent" },
  { name: "建筑节能", score: 88, status: "good" },
  { name: "无障碍设施", score: 90, status: "excellent" },
  { name: "消防工程", score: 92, status: "excellent" },
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
        let statusText = "";
        let statusColor = "";

        if (params[0].data.status === "excellent") {
          statusText = "优秀";
          statusColor = "#00ff00";
        } else if (params[0].data.status === "good") {
          statusText = "良好";
          statusColor = "#ff9f1c";
        } else if (params[0].data.status === "qualified") {
          statusText = "合格";
          statusColor = "#ffff00";
        } else if (params[0].data.status === "unqualified") {
          statusText = "不合格";
          statusColor = "#ff0000";
        }

        return `${params[0].name}<br/>评分: ${params[0].value}<br/>等级: <span style="color: ${statusColor}">${statusText}</span>`;
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
      data: qualityData.value.map(item => item.name),
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
        formatter: "{value}分",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.2)",
        },
      },
    },
    series: [
      {
        name: "施工质量评分",
        type: "bar",
        data: qualityData.value.map(item => ({
          value: item.score,
          status: item.status,
          itemStyle: {
            color: item.status === "excellent" ? "#00ff00" : item.status === "good" ? "#ff9f1c" : item.status === "qualified" ? "#ffff00" : "#ff0000",
          },
        })),
        barWidth: "60%",
        label: {
          show: true,
          position: "top",
          color: "#fff",
          fontSize: 10,
          formatter: "{c}分",
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * qualityData.value.length);
  const randomChange = (Math.random() * 4) - 2; // -2 到 2 分变化

  qualityData.value[randomIndex].score = Math.max(0, Math.min(100, qualityData.value[randomIndex].score + randomChange));

  // 更新质量状态
  if (qualityData.value[randomIndex].score >= 90) {
    qualityData.value[randomIndex].status = "excellent";
  } else if (qualityData.value[randomIndex].score >= 80) {
    qualityData.value[randomIndex].status = "good";
  } else if (qualityData.value[randomIndex].score >= 60) {
    qualityData.value[randomIndex].status = "qualified";
  } else {
    qualityData.value[randomIndex].status = "unqualified";
  }

  // 更新统计数据
  const totalScore = qualityData.value.reduce((sum, item) => sum + item.score, 0);
  overallScore.value = Math.round((totalScore / qualityData.value.length) * 10) / 10;

  // 更新质量等级
  if (overallScore.value >= 90) {
    qualityGrade.value = "优秀";
  } else if (overallScore.value >= 80) {
    qualityGrade.value = "优良";
  } else if (overallScore.value >= 70) {
    qualityGrade.value = "良好";
  } else if (overallScore.value >= 60) {
    qualityGrade.value = "合格";
  } else {
    qualityGrade.value = "不合格";
  }

  // 更新合格分项工程数量
  qualifiedItems.value = qualityData.value.filter(item => item.score >= 60).length;

  if (chartInstance) {
    chartInstance.setOption({
      xAxis: {
        data: qualityData.value.map(item => item.name),
      },
      series: [
        {
          data: qualityData.value.map(item => ({
            value: item.score,
            status: item.status,
            itemStyle: {
              color: item.status === "excellent" ? "#00ff00" : item.status === "good" ? "#ff9f1c" : item.status === "qualified" ? "#ffff00" : "#ff0000",
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

  // 每6分钟更新一次数据
  const timer = setInterval(updateChart, 360000);

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
.construction-quality-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.quality-stats {
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
    .grade {
      color: #00ff00;
    }
    .qualified {
      color: #ff9f1c;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>