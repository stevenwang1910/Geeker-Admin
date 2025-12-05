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
    trigger: "item",
    formatter: "{b}: {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      color: "#fff"
    }
  },
  series: [
    {
      name: "数据比例",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: "bold",
          color: "#fff"
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 335, name: "数据1", itemStyle: { color: "#05e8fe" } },
        { value: 310, name: "数据2", itemStyle: { color: "#29fcff" } },
        { value: 234, name: "数据3", itemStyle: { color: "#00ff88" } },
        { value: 135, name: "数据4", itemStyle: { color: "#ff0080" } },
        { value: 1548, name: "数据5", itemStyle: { color: "#ff8000" } }
      ]
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
