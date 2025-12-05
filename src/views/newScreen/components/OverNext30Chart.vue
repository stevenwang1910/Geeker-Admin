<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";
import dayjs from "dayjs";

const initDate = (): string[] => {
  const dateList: string[] = [];
  let startDate = dayjs();
  const endDate = startDate.add(30, "day");
  while (startDate.isBefore(endDate)) {
    const month = startDate.format("MM");
    const day = startDate.format("DD");
    dateList.push(`${month}/${day}`);
    startDate = startDate.add(1, "day");
  }
  return dateList;
};

const data = new Array(31).fill("").map(() => Math.floor(Math.random() * 1000));

const option: ECOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
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
      boundaryGap: false,
      data: initDate(),
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      },
      axisLabel: {
        color: "#fff",
        rotate: 45
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
      name: "未来30天数据",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 2,
        color: "#05e8fe"
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(5, 232, 254, 0.5)" },
            { offset: 1, color: "rgba(5, 232, 254, 0)" }
          ]
        }
      },
      data: data
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
