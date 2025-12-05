<template>
  <!-- 项目时间线 -->
  <div class="project-timeline">
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
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    data: ["计划进度", "实际进度"],
    textStyle: {
      color: "#ffffff"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    axisLabel: {
      color: "#ffffff"
    },
    axisLine: {
      lineStyle: {
        color: "#475569"
      }
    }
  },
  yAxis: {
    type: "value",
    name: "完成百分比(%)",
    nameTextStyle: {
      color: "#ffffff"
    },
    axisLabel: {
      color: "#ffffff",
      formatter: "{value}%"
    },
    axisLine: {
      lineStyle: {
        color: "#475569"
      }
    },
    splitLine: {
      lineStyle: {
        color: "#1e293b",
        type: "dashed"
      }
    }
  },
  series: [
    {
      name: "计划进度",
      type: "line",
      data: [8, 16, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100],
      smooth: true,
      itemStyle: {
        color: "#fbbf24"
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(251, 191, 36, 0.3)" },
          { offset: 1, color: "rgba(251, 191, 36, 0)" }
        ])
      }
    },
    {
      name: "实际进度",
      type: "line",
      data: [5, 12, 20, 28, 35, 43, 50, 58, 65, 72, 80, 88],
      smooth: true,
      itemStyle: {
        color: "#ff6b35"
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255, 107, 53, 0.3)" },
          { offset: 1, color: "rgba(255, 107, 53, 0)" }
        ])
      }
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.project-timeline {
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
