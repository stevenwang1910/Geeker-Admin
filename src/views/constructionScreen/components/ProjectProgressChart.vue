<template>
  <!-- 项目进度概览 -->
  <div class="project-progress">
    <div class="progress-summary">
      <div class="summary-item">
        <div class="item-label">总项目数</div>
        <div class="item-value">{{ totalProjects }}</div>
      </div>
      <div class="summary-item">
        <div class="item-label">进行中</div>
        <div class="item-value">{{ ongoingProjects }}</div>
      </div>
      <div class="summary-item">
        <div class="item-label">已完成</div>
        <div class="item-value">{{ completedProjects }}</div>
      </div>
    </div>
    <div class="echarts">
      <ECharts :option="option" :resize="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

// 模拟数据
const totalProjects = ref(12);
const ongoingProjects = ref(8);
const completedProjects = ref(4);

const option = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)"
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
      name: "项目状态",
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
        { value: ongoingProjects.value, name: "进行中", itemStyle: { color: "#ff6b35" } },
        { value: completedProjects.value, name: "已完成", itemStyle: { color: "#4ade80" } },
        {
          value: totalProjects.value - ongoingProjects.value - completedProjects.value,
          name: "未开始",
          itemStyle: { color: "#64748b" }
        }
      ]
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.project-progress {
  display: flex;
  flex-direction: column;
  height: 100%;
  .progress-summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    .summary-item {
      text-align: center;
      .item-label {
        margin-bottom: 5px;
        font-size: 14px;
        color: #94a3b8;
      }
      .item-value {
        font-size: 24px;
        font-weight: bold;
        color: #ff6b35;
      }
    }
  }
  .echarts {
    flex: 1;
    width: 100%;
  }
}
</style>
