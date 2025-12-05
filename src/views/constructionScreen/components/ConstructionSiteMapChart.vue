<template>
  <!-- 施工现场地图 -->
  <div id="siteMapChart" class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import echarts, { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

// 模拟施工现场地图数据
const siteData = [
  { name: "施工区域A", value: 120, coords: [116.4, 39.9] },
  { name: "施工区域B", value: 80, coords: [116.41, 39.91] },
  { name: "施工区域C", value: 150, coords: [116.42, 39.92] },
  { name: "施工区域D", value: 90, coords: [116.43, 39.93] },
  { name: "施工区域E", value: 110, coords: [116.44, 39.94] }
];

const option: ECOption = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}人"
  },
  grid: {
    left: "0px",
    right: "80px",
    top: "10px",
    bottom: "10px"
  },
  geo: {
    map: "china",
    zoom: 12,
    center: [116.42, 39.92],
    scaleLimit: {
      min: 10,
      max: 15
    },
    label: {
      color: "#fff",
      show: true
    },
    emphasis: {
      label: {
        color: "#fff",
        show: true
      },
      itemStyle: {
        areaColor: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#1a365d" },
            { offset: 1, color: "#2d3748" }
          ]
        }
      }
    },
    roam: false,
    itemStyle: {
      areaColor: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: "#1a365d" },
          { offset: 1, color: "#2d3748" }
        ]
      },
      borderColor: new echarts.graphic.LinearGradient(
        0,
        0,
        0,
        1,
        [
          { offset: 0, color: "#ff6b35" },
          { offset: 1, color: "#ff9500" }
        ],
        false
      ),
      shadowColor: "rgba(255, 107, 53, 0.3)",
      shadowOffsetY: 0,
      shadowBlur: 30,
      borderWidth: 1
    },
    tooltip: {
      show: false
    }
  },
  series: [
    {
      name: "施工区域人员分布",
      type: "scatter",
      coordinateSystem: "geo",
      data: siteData.map(item => ({
        name: item.name,
        value: [...item.coords, item.value]
      })),
      symbolSize: function (val) {
        return val[2] / 5;
      },
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
        color: "#ffffff"
      },
      itemStyle: {
        color: "#ff6b35",
        shadowBlur: 10,
        shadowColor: "#ff6b35"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: "#ff6b35"
        }
      }
    },
    {
      name: "区域连接线",
      type: "lines",
      coordinateSystem: "geo",
      zlevel: 1,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: "#ff6b35",
        symbolSize: 3
      },
      lineStyle: {
        color: "#ff6b35",
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      },
      data: [
        {
          fromName: "施工区域A",
          toName: "施工区域B",
          coords: [
            [116.4, 39.9],
            [116.41, 39.91]
          ]
        },
        {
          fromName: "施工区域B",
          toName: "施工区域C",
          coords: [
            [116.41, 39.91],
            [116.42, 39.92]
          ]
        },
        {
          fromName: "施工区域C",
          toName: "施工区域D",
          coords: [
            [116.42, 39.92],
            [116.43, 39.93]
          ]
        },
        {
          fromName: "施工区域D",
          toName: "施工区域E",
          coords: [
            [116.43, 39.93],
            [116.44, 39.94]
          ]
        },
        {
          fromName: "施工区域E",
          toName: "施工区域A",
          coords: [
            [116.44, 39.94],
            [116.4, 39.9]
          ]
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
