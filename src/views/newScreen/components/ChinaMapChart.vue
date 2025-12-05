<template>
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";
import * as echarts from "echarts";
import chinaJson from "../assets/china.json";

// Register China map data
if (!echarts.getMap("china")) {
  echarts.registerMap("china", chinaJson);
}

const option: ECOption = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}"
  },
  visualMap: {
    min: 0,
    max: 1000,
    left: "left",
    top: "bottom",
    text: ["高", "低"],
    calculable: true,
    inRange: {
      color: ["#05e8fe", "#29fcff", "#00ff88", "#ff0080", "#ff8000"]
    }
  },
  series: [
    {
      name: "数据分布",
      type: "map",
      map: "china",
      roam: false,
      zoom: 1.2,
      label: {
        show: true,
        color: "#fff",
        fontSize: 10
      },
      itemStyle: {
        areaColor: "#1a1a2e",
        borderColor: "#fff",
        borderWidth: 1
      },
      emphasis: {
        label: {
          show: true,
          color: "#fff",
          fontSize: 12
        },
        itemStyle: {
          areaColor: "#05e8fe"
        }
      },
      data: [
        { name: "北京", value: 120 },
        { name: "天津", value: 80 },
        { name: "河北", value: 150 },
        { name: "山西", value: 100 },
        { name: "内蒙古", value: 200 },
        { name: "辽宁", value: 180 },
        { name: "吉林", value: 130 },
        { name: "黑龙江", value: 160 },
        { name: "上海", value: 140 },
        { name: "江苏", value: 220 },
        { name: "浙江", value: 250 },
        { name: "安徽", value: 170 },
        { name: "福建", value: 190 },
        { name: "江西", value: 140 },
        { name: "山东", value: 280 },
        { name: "河南", value: 300 },
        { name: "湖北", value: 210 },
        { name: "湖南", value: 230 },
        { name: "广东", value: 350 },
        { name: "广西", value: 180 },
        { name: "海南", value: 90 },
        { name: "重庆", value: 160 },
        { name: "四川", value: 240 },
        { name: "贵州", value: 120 },
        { name: "云南", value: 150 },
        { name: "西藏", value: 80 },
        { name: "陕西", value: 130 },
        { name: "甘肃", value: 100 },
        { name: "青海", value: 70 },
        { name: "宁夏", value: 90 },
        { name: "新疆", value: 110 },
        { name: "台湾", value: 100 },
        { name: "香港", value: 80 },
        { name: "澳门", value: 50 }
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
