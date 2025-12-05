<template>
  <div class="construction-site-map-chart">
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="ConstructionSiteMapChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟施工现场区域数据
const siteData = ref([
  { name: "办公区", x: 10, y: 10, status: "normal", personnel: 25 },
  { name: "生活区", x: 10, y: 30, status: "normal", personnel: 180 },
  { name: "材料堆放区", x: 10, y: 50, status: "normal", materials: 1200 },
  { name: "钢筋加工区", x: 30, y: 10, status: "normal", equipment: 8 },
  { name: "模板加工区", x: 30, y: 30, status: "normal", equipment: 6 },
  { name: "混凝土搅拌区", x: 30, y: 50, status: "fault", equipment: 4 },
  { name: "主体施工区A", x: 50, y: 10, status: "normal", personnel: 60 },
  { name: "主体施工区B", x: 50, y: 30, status: "normal", personnel: 75 },
  { name: "主体施工区C", x: 50, y: 50, status: "warning", personnel: 55 },
  { name: "装饰装修区", x: 70, y: 10, status: "normal", personnel: 35 },
  { name: "水电安装区", x: 70, y: 30, status: "normal", personnel: 40 },
  { name: "竣工验收区", x: 70, y: 50, status: "normal", personnel: 15 },
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
        let statusText = "";
        let statusColor = "";

        if (params.data.status === "normal") {
          statusText = "正常";
          statusColor = "#00ff00";
        } else if (params.data.status === "warning") {
          statusText = "警告";
          statusColor = "#ff9f1c";
        } else if (params.data.status === "fault") {
          statusText = "故障";
          statusColor = "#ff0000";
        }

        let additionalInfo = "";
        if (params.data.personnel) {
          additionalInfo += `<br/>施工人员: ${params.data.personnel}`;
        }
        if (params.data.equipment) {
          additionalInfo += `<br/>设备数量: ${params.data.equipment}`;
        }
        if (params.data.materials) {
          additionalInfo += `<br/>材料存量: ${params.data.materials}吨`;
        }

        return `${params.data.name}<br/>状态: <span style="color: ${statusColor}">${statusText}</span>${additionalInfo}`;
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
      type: "value",
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: "#ff9f1c",
        },
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.1)",
        },
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
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 159, 28, 0.1)",
        },
      },
    },
    series: [
      {
        name: "施工现场区域",
        type: "scatter",
        data: siteData.value.map(item => ({
          value: [item.x, item.y],
          name: item.name,
          status: item.status,
          personnel: item.personnel,
          equipment: item.equipment,
          materials: item.materials,
          symbolSize: item.personnel ? item.personnel / 5 : item.equipment ? item.equipment * 5 : item.materials ? item.materials / 200 : 20,
          itemStyle: {
            color: item.status === "normal" ? "#00ff00" : item.status === "warning" ? "#ff9f1c" : "#ff0000",
            opacity: 0.8,
          },
        })),
        label: {
          show: true,
          position: "top",
          color: "#fff",
          fontSize: 12,
          formatter: (params: any) => params.data.name,
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * siteData.value.length);
  const statuses = ["normal", "warning", "fault"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  siteData.value[randomIndex].status = randomStatus;

  // 模拟人员数量变化
  if (siteData.value[randomIndex].personnel) {
    const randomChange = Math.floor(Math.random() * 10) - 5; // -5 to 5
    siteData.value[randomIndex].personnel = Math.max(0, siteData.value[randomIndex].personnel + randomChange);
  }

  if (chartInstance) {
    chartInstance.setOption({
      series: [
        {
          data: siteData.value.map(item => ({
            value: [item.x, item.y],
            name: item.name,
            status: item.status,
            personnel: item.personnel,
            equipment: item.equipment,
            materials: item.materials,
            symbolSize: item.personnel ? item.personnel / 5 : item.equipment ? item.equipment * 5 : item.materials ? item.materials / 200 : 20,
            itemStyle: {
              color: item.status === "normal" ? "#00ff00" : item.status === "warning" ? "#ff9f1c" : "#ff0000",
              opacity: 0.8,
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

  // 每3分钟更新一次数据
  const timer = setInterval(updateChart, 180000);

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
.construction-site-map-chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>