<template>
  <!-- 施工质量评估 -->
  <div class="construction-quality">
    <div class="quality-summary">
      <div class="summary-item">
        <div class="item-label">合格率</div>
        <div class="item-value" style="color: #4ade80">{{ qualificationRate }}%</div>
      </div>
      <div class="summary-item">
        <div class="item-label">优良率</div>
        <div class="item-value" style="color: #60a5fa">{{ excellentRate }}%</div>
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
const qualificationRate = ref(98.5);
const excellentRate = ref(85.2);

const option = {
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
  xAxis: {
    type: "category",
    data: ["基础工程", "主体工程", "装饰工程", "水电工程", "暖通工程"],
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
    name: "质量评分",
    nameTextStyle: {
      color: "#ffffff"
    },
    axisLabel: {
      color: "#ffffff",
      formatter: "{value}"
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
      name: "质量评分",
      type: "bar",
      data: [98, 97, 99, 96, 98],
      itemStyle: {
        color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#4ade80" },
          { offset: 1, color: "#22c55e" }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: "top",
        color: "#ffffff"
      }
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.construction-quality {
  height: 100%;
  display: flex;
  flex-direction: column;

  .quality-summary {
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
