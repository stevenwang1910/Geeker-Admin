<template>
  <!-- 安全监测指标 -->
  <div class="safety-monitoring">
    <div class="safety-summary">
      <div class="summary-item">
        <div class="item-label">安全隐患</div>
        <div class="item-value" style="color: #f87171">{{ safetyHazards }}</div>
      </div>
      <div class="summary-item">
        <div class="item-label">整改完成</div>
        <div class="item-value" style="color: #4ade80">{{ rectificationCompleted }}</div>
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
const safetyHazards = ref(12);
const rectificationCompleted = ref(8);

const option = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}项 ({d}%)"
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
      name: "安全隐患状态",
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
        { value: rectificationCompleted.value, name: "已整改", itemStyle: { color: "#4ade80" } },
        { value: safetyHazards.value - rectificationCompleted.value, name: "待整改", itemStyle: { color: "#f87171" } },
        { value: 3, name: "整改中", itemStyle: { color: "#fbbf24" } }
      ]
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.safety-monitoring {
  height: 100%;
  display: flex;
  flex-direction: column;

  .safety-summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;

    .summary-item {
      text-align: center;

      .item-label {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 5px;
      }

      .item-value {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .echarts {
    flex: 1;
    width: 100%;
  }
}
</style>
