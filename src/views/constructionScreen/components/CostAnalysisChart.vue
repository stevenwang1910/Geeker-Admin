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
  { name: "材料成本", value: 450, percentage: "45%" },
  { name: "人工成本", value: 250, percentage: "25%" },
  { name: "设备租赁", value: 150, percentage: "15%" },
  { name: "管理费用", value: 100, percentage: "10%" },
  { name: "其他费用", value: 50, percentage: "5%" }
];

const option: ECOption = {
  grid: {
    top: "0%",
    left: "2%",
    right: "2%",
    bottom: "0%"
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} :  {c}万元"
  },
  legend: {
    show: true,
    top: "middle",
    left: "20px",
    icon: "circle",
    orient: "vertical",
    align: "auto",
    itemWidth: 10,
    textStyle: {
      color: "#fff"
    },
    itemGap: 20,
    formatter: function (name: string) {
      let text = "";
      data.forEach((val: ChartProp) => {
        if (val.name === name) {
          text = name + " --- " + val.percentage;
        }
      });
      return text;
    },
    data: data.map((val: ChartProp) => val.name)
  },
  series: [
    {
      type: "pie",
      radius: ["60%", "85%"],
      center: ["68%", "45%"],
      color: ["#0E7CE2", "#FF8352", "#E271DE", "#F8456B", "#7EC7FF"],
      itemStyle: {
        borderColor: "#031845",
        borderWidth: 10
      },
      data: data,
      labelLine: {
        show: false
      },
      label: {
        show: false
      }
    },
    {
      type: "pie",
      radius: ["20%", "28%"],
      center: ["68%", "45%"],
      color: ["#ffffff", "red"],
      startAngle: 105,
      data: [
        {
          value: 30,
          name: "",
          itemStyle: {
            color: "transparent"
          }
        },
        {
          value: 5,
          name: "",
          itemStyle: {
            color: "transparent"
          }
        },
        {
          value: 65,
          name: "ddd",
          itemStyle: {
            color: "#ffffff"
          }
        }
      ],
      silent: true,
      labelLine: {
        show: false
      },
      label: {
        show: false
      }
    },
    {
      type: "pie",
      radius: [0, "30%"],
      center: ["68%", "45%"],
      startAngle: 90,
      data: [
        {
          value: 25,
          name: "1",
          itemStyle: {
            color: "transparent",
            borderWidth: 4,
            borderColor: "#ffffff"
          }
        },
        {
          value: 75,
          name: "2",
          itemStyle: {
            color: "transparent"
          }
        }
      ],
      selectedOffset: 10,
      silent: true,
      labelLine: {
        show: false
      },
      label: {
        show: false
      }
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
