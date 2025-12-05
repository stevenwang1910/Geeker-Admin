<template>
  <!-- 设备状态监测 -->
  <div class="equipment-status">
    <div class="equipment-summary">
      <div class="summary-item">
        <div class="item-label">正常运行</div>
        <div class="item-value" style="color: #4ade80">{{ normalEquipment }}</div>
      </div>
      <div class="summary-item">
        <div class="item-label">异常设备</div>
        <div class="item-value" style="color: #f87171">{{ abnormalEquipment }}</div>
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
const normalEquipment = ref(42);
const abnormalEquipment = ref(3);

const option = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}台 ({d}%)"
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
      name: "设备状态",
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
        { value: normalEquipment.value, name: "正常运行", itemStyle: { color: "#4ade80" } },
        { value: abnormalEquipment.value, name: "异常设备", itemStyle: { color: "#f87171" } },
        { value: 5, name: "维护中", itemStyle: { color: "#fbbf24" } }
      ]
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.equipment-status {
  height: 100%;
  display: flex;
  flex-direction: column;

  .equipment-summary {
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
