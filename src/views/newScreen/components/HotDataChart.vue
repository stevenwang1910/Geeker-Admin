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
  yAxis: [
    {
      type: "category",
      data: ["数据1", "数据2", "数据3", "数据4", "数据5", "数据6", "数据7", "数据8", "数据9", "数据10"],
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
  series: [
    {
      name: "热门数据",
      type: "bar",
      data: [335, 310, 234, 135, 1048, 250, 200, 180, 150, 120],
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: "#05e8fe" },
            { offset: 1, color: "#29fcff" }
          ]
        },
        borderRadius: [0, 5, 5, 0]
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
