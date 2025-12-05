<template>
  <div class="equipment-status-chart">
    <div class="equipment-stats">
      <div class="stat-item">
        <div class="stat-label">设备总数</div>
        <div class="stat-value">{{ totalEquipment }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">正常运行</div>
        <div class="stat-value normal">{{ normalEquipment }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">故障设备</div>
        <div class="stat-value fault">{{ faultEquipment }}</div>
      </div>
    </div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts" name="EquipmentStatusChart">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 模拟数据
const totalEquipment = ref(45);
const normalEquipment = ref(38);
const faultEquipment = ref(7);

const equipmentData = ref([
  { name: "塔吊", status: "normal", value: 8 },
  { name: "挖掘机", status: "normal", value: 12 },
  { name: "装载机", status: "normal", value: 6 },
  { name: "搅拌机", status: "normal", value: 5 },
  { name: "起重机", status: "fault", value: 2 },
  { name: "压路机", status: "fault", value: 3 },
  { name: "摊铺机", status: "fault", value: 2 },
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
          statusText = "正常运行";
          statusColor = "#00ff00";
        } else if (params.data.status === "fault") {
          statusText = "故障";
          statusColor = "#ff0000";
        }

        return `${params.data.name}<br/>状态: <span style="color: ${statusColor}">${statusText}</span><br/>数量: ${params.data.value}`;
      },
    },
    series: [
      {
        name: "设备状态",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
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
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        data: equipmentData.value.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.status === "normal" ? "#00ff00" : "#ff0000",
          },
        })),
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  // 模拟实时数据更新
  const randomIndex = Math.floor(Math.random() * equipmentData.value.length);
  const randomStatus = Math.random() > 0.8 ? "fault" : "normal";

  equipmentData.value[randomIndex].status = randomStatus;

  // 更新统计数据
  normalEquipment.value = equipmentData.value.filter(item => item.status === "normal").reduce((sum, item) => sum + item.value, 0);
  faultEquipment.value = equipmentData.value.filter(item => item.status === "fault").reduce((sum, item) => sum + item.value, 0);

  if (chartInstance) {
    chartInstance.setOption({
      series: [
        {
          data: equipmentData.value.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.status === "normal" ? "#00ff00" : "#ff0000",
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

  // 每1分钟更新一次数据
  const timer = setInterval(updateChart, 60000);

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
.equipment-status-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.equipment-stats {
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
    .normal {
      color: #00ff00;
    }
    .fault {
      color: #ff0000;
    }
  }
}

.chart-container {
  flex: 1;
  width: 100%;
}
</style>