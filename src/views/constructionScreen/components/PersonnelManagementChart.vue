<template>
  <!-- 人员管理统计 -->
  <div class="personnel-management">
    <div class="personnel-summary">
      <div class="summary-item">
        <div class="item-label">总人数</div>
        <div class="item-value">{{ totalPersonnel }}</div>
      </div>
      <div class="summary-item">
        <div class="item-label">在场人数</div>
        <div class="item-value">{{ onSitePersonnel }}</div>
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
const totalPersonnel = ref(245);
const onSitePersonnel = ref(189);

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
    data: ["管理人员", "技术人员", "施工人员", "后勤人员"],
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
    axisLabel: {
      color: "#ffffff"
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
      name: "总人数",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series"
      },
      data: [25, 45, 150, 25],
      itemStyle: {
        color: "#ff6b35",
        borderRadius: [4, 4, 0, 0]
      }
    },
    {
      name: "在场人数",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series"
      },
      data: [20, 38, 115, 16],
      itemStyle: {
        color: "#4ade80",
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
} as ECOption;
</script>

<style lang="scss" scoped>
.personnel-management {
  height: 100%;
  display: flex;
  flex-direction: column;

  .personnel-summary {
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
