<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";

interface ChartProp {
  name: string;
  value: number;
  percentage: string;
}

const data: ChartProp[] = [
  { name: "土方工程", value: 85, percentage: "85%" },
  { name: "混凝土工程", value: 72, percentage: "72%" },
  { name: "钢筋工程", value: 90, percentage: "90%" },
  { name: "模板工程", value: 68, percentage: "68%" },
  { name: "砌体工程", value: 78, percentage: "78%" }
];

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

const option: ECOption = {
  color: colors,
  tooltip: {
    show: true,
    trigger: "item",
    formatter: "{b} <br/>进度：{c}%"
  },
  legend: {
    orient: "horizontal",
    bottom: "0%",
    left: "center",
    itemGap: 15,
    itemWidth: 14,
    formatter: function (name: string) {
      let text = "";
      data.forEach((val: ChartProp) => {
        if (val.name === name) text = " " + name + "　 " + val.percentage;
      });
      return text;
    },
    textStyle: { color: "#fff" }
  },
  grid: { top: "bottom", left: 10, bottom: 10 },
  series: [
    {
      zlevel: 1,
      name: "施工现场指标",
      type: "pie",
      selectedMode: "single",
      radius: [50, 90],
      center: ["50%", "40%"],
      startAngle: 60,
      label: {
        position: "inside",
        show: true,
        color: "#fff",
        formatter: function (params) {
          return (params.data as ChartProp).percentage;
        },
        rich: {
          b: {
            fontSize: 16,
            lineHeight: 30,
            color: "#fff"
          }
        }
      },
      itemStyle: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowBlur: 10
      },
      data: data.map((val: ChartProp, index: number) => {
        return {
          value: val.value,
          name: val.name,
          percentage: val.percentage,
          itemStyle: {
            borderWidth: 10,
            shadowBlur: 20,
            borderColor: colors[index],
            borderRadius: 10
          }
        };
      })
    },
    {
      name: "",
      type: "pie",
      selectedMode: "single",
      radius: [50, 90],
      center: ["50%", "40%"],
      startAngle: 60,
      data: [
        {
          value: 1000,
          name: "",
          label: {
            show: true,
            formatter: "{a|施工进度}",
            rich: {
              a: {
                align: "center",
                color: "rgb(98,137,169)",
                fontSize: 14
              }
            },
            position: "center"
          }
        }
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
