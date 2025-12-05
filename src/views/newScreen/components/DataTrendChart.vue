<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";

const option: ECOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      },
      axisLabel: {
        color: "#fff"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      },
      axisLabel: {
        color: "#fff"
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      }
    }
  ],
  series: [
    {
      name: "数据趋势",
      type: "bar",
      data: [120, 200, 150, 80, 70, 110, 130, 150, 180, 220, 250, 300],
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#05e8fe" },
            { offset: 1, color: "#29fcff" }
          ]
        },
        borderRadius: [5, 5, 0, 0]
      }
    }
  ]
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
