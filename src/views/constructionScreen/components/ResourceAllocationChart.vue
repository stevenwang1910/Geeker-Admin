<template>
  <!-- 资源分配统计 -->
  <div class="resource-allocation">
    <div class="echarts">
      <ECharts :option="option" :resize="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

// 模拟数据
const option = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}万元 ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      color: "#ffffff"
    }
  },
  series: [
    {
      name: "资源分配",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#1a365d",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
          color: "#ffffff"
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 2500, name: "人工费用", itemStyle: { color: "#ff6b35" } },
        { value: 1800, name: "材料费用", itemStyle: { color: "#4ade80" } },
        { value: 1200, name: "设备租赁", itemStyle: { color: "#fbbf24" } },
        { value: 800, name: "其他费用", itemStyle: { color: "#60a5fa" } }
      ]
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.resource-allocation {
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
